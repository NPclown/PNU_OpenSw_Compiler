/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var shell = require('shelljs');
var child_process = require('child_process');
var Sync = require('sync');
var request = require('request');
var session = require('express-session');
var qs = require('querystring');
var url = require('url');
var randomString = require('randomstring');
var mkdirp = require('mkdirp');
var fb = require('./web.js');

var child = child_process.fork(__dirname + '/compile.js');
var taskId = 0;
var tasks = {};
var maxQueue = 10; // menentukan seberapa banyak queue yang bisa dilayani oleh satu server
var redirect_uri = 'http://164.125.234.247:3000/auth/github/callback';

var app = express();

// 추가 시작
fb.configure({
    removeLockString: true,

    /*
     * Example of otherRoots.
     * The other roots are listed and displayed, but their
     * locations need to be calculated by the server.
     * See OTHERROOTS in the app.
     */
    otherRoots: ['/tmp', '/broken']
});

var argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('$0', 'Browse file system.')
    .example('$0 -e .js .swf .apk', 'Exclude extensions while browsing.')
    .alias('i', 'include')
    .array('i')
    .describe('i', 'File extension to include.')
    .alias('e', 'exclude')
    .array('e')
    .describe('e', 'File extensions to exclude.')
    .alias('p', 'port')
    .describe('p', 'Port to run the file-browser. [default:8088]')
    .help('h')
    .alias('h', 'help')
    .check(checkValidity)
    .argv;

function checkValidity(argv) {
    if (argv.i && argv.e) return new Error('Select -i or -e.');
    if (argv.i && argv.i.length === 0) return new Error('Supply at least one extension for -i option.');
    if (argv.e && argv.e.length === 0) return new Error('Supply at least one extension for -e option.');
    return true;
}

// 추가 끝
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.static('views'));
app.use(
    session({
        secret: randomString.generate(),
        cookie: {maxAge: 60000*60},
        resave: false,
        saveUninitialized: false
    })
);

app.use(app.router);
app.use(express.static(__dirname)); // module
fb.setcwd(process.cwd(), argv.include, argv.exclude);

// 추가 끝
function addTask(data, callback) {
    // taskId++;
    // if (taskId > 10) taskId = 1;
    Sync(function () {
        taskId++;
        if (taskId > maxQueue) taskId = 1;

        child.send({
            id: taskId,
            script: data.script,
            inputs: data.inputs,
            language: data.language,
        });

        tasks[taskId] = callback;
    });
}

child.on('message', function (message) {
    // Look up the callback bound to this id and invoke it with the result
    // console.log(message);
    tasks[message.id](message);
});

app.get('/', function (req, res) {
    res.send("node compiler v0.2");
});

app.get('/web', function (req, res) {
    req.session.login = '/web';
    console.log("web is called" + req.session.dir)
    console.log("first call session.name is " + req.session.name)
    if(req.session.name !== undefined ) {
        fs.access(req.session.dir, error =>{
            if (error){
                shell.exec("npx create-react-app "+req.session.dir)
            }
        })
    }

    if(req.session.name !== undefined)
        fb.setcwd(req.session.dir, argv.include, argv.exclude);
    else
        fb.setcwd(process.cwd(), argv.include, argv.exclude);

    res.render("index_web.ejs", {
        title: req.session.title,
        name: req.session.name,
        user_id: req.session.user_id
    });
});

app.get('/compile', function (req, res) {
    req.session.login = '/compile'
    
    if(req.session.name !== undefined)
        fb.setcwd(req.session.compile_dir, argv.include, argv.exclude);
    else
        fb.setcwd(process.cwd(), argv.include, argv.exclude);
        
    res.render('index_compile.ejs', {
        title: req.session.title,
        name: req.session.name,
        user_id: req.session.user_id
    });
});

//index_web.js 관련
// 추가버전 시작
app.get('/b', function (req, res) {
    let file;
    if (req.query.r === '/tmp') {

        /*
         * OTHERROOTS
         * This is an example of a manually calculated path.
         */
        file = path.join(req.query.r, req.query.f);
        console.log("path is: " + file)
    } else {
        file = path.join(req.session.dir, req.query.f);
        console.log("path is: " + file)
    }
    res.readFile(file);
})

app.get('/files', fb.get);
// 추가버전 끝

var count_docker = 3001;

app.get('/api/run_server', function (req, res) {
    console.log("do docker port is "+count_docker);
    shell.exec('sudo docker run -d --name '+req.session.user_id+' -p '+ count_docker+':3000'+' -v '+req.session.dir+':/home/web/my-app qkrwlghddlek/ubuntu_react sh -c "cd /home/web/my-app; npm start"')
    req.session.port = count_docker;
    count_docker +=1;
    res.send({success: true, port: req.session.port});
});

app.get('/api/stop_server', function (req, res) {
    console.log("stop docker "+ req.session.user_id);
    shell.exec('sudo docker rm -f '+req.session.user_id);
    res.send({success: true});
});

app.post('/api/save_file', function (req, res) {
    var dataString = req.body.dataString;
    
    var file_path;
    if (req.session.login == '/compile'){
        file_path = "save/"+req.session.name+"/"+req.body.file_path;;
    }else{
        file_path = "save/"+req.session.name+"/"+"web"+"/"+req.body.file_path;;
    }

    fs.writeFile(file_path, dataString, "utf8", function (error) {
        if (error) {
            throw error
        }
        ;
        res.send({success: true});
    });
});

app.get('/api/create_file', function (req, res) {
    console.log("##create##");
    var file_path;
    if (req.session.login == '/compile'){
        file_path = "save/"+req.session.name+"/"+req.query.path;
    }else{
        file_path = "save/"+req.session.name+"/"+"web"+"/"+req.query.path;
    }

    fs.writeFile(file_path, "", "utf8", function (error, data) {
        if (error) {
            throw error
        }
        ;
        console.log(data);
        res.send({success: true});
        // res.json(data);
    });
});

app.get('/api/delete_file', function (req, res) {
    console.log("##delete##");
    var file_path;
    if (req.session.login == '/compile'){
        file_path = "save/"+req.session.name+"/"+req.query.path;
    }else{
        file_path = "save/"+req.session.name+"/"+"web"+"/"+req.query.path;
    }

    fs.unlink(file_path, function (error) {
        if (error) {
            console.log("no file " + error)
        }
        ;
        res.send({success: true});
        // console.log(data);
        // res.json(data);
    });
});

app.post('/api/read_file', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    console.log("###body###");
    console.log(req.body);
    var file_path = req.body.file_path;             // 컴파일 옵션
    console.log(file_path);
    fs.readFile(file_path, "utf8", function (err, data) {
        if (err) throw err;
        res.send({data: data, success: true});
    })
});

//index_conpile.ejs 관련
app.post('/api/compile', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    console.log("###body###");
    console.log(req.body);
    var script = req.body.dataString;           // 소스코드
    var inputs = req.body.inputs;               // 인자값
    var language = req.body.language;           // 언어 종류
    console.log(language);
    // child.js에 인자 넘기기
    addTask({script: script, inputs: inputs, language: language}, function (result) {
        console.log("###result###");
        console.log(result);
        res.json(result);
    });
});

app.post('/api/save', function (req, res) {
    console.log("##save##");
    console.log(req.body);
    
    if (req.body.username != '') {
        var dir = "save/" + req.session.name + "/";
        var filename = req.body.file_name;
        var script = req.body.dataString;
        console.log("dir : "+dir);
        fs.stat(dir + filename, function (err) {
            if (!err) {
                res.json({"state": "File Name is Exisit!!"});
            } else if (err.code === 'ENOENT') {
                fs.writeFile(dir + filename, script, "utf8", function (error, data) {
                    if (error) {
                        throw error
                    }
                    res.json({"state": "Save Compile"});
                });
            }
        });
    } else {
        res.json({"state": "Server Save Error"});
    }
});

//로그인 관련
app.get('/login', (req, res, next) => {
    req.session.csrf_string = randomString.generate();
    const githubAuthUrl =
        'https://github.com/login/oauth/authorize?' +
        qs.stringify({
            client_id: 'e472c7ced670e3120b61',
            redirect_uri: redirect_uri,
            state: req.session.csrf_string,
            scope: 'user:email'
        });
    res.redirect(githubAuthUrl);
});

app.all('/auth/github/callback', (req, res) => {
    console.log(req.session);
    const code = req.query.code;
    const returnedState = req.query.state;
    if (req.session.csrf_string === returnedState) {
        request.post(
            {
                url:
                    'https://github.com/login/oauth/access_token?' +
                    qs.stringify({
                        client_id: 'e472c7ced670e3120b61',
                        client_secret: 'ede3631278b6f94f5641eec214180ba9a47e4c0e',
                        code: code,
                        redirect_uri: redirect_uri,
                        state: req.session.csrf_string
                    })
            },
            (error, response, body) => {
                console.log(body);
                req.session.access_token = qs.parse(body).access_token;
                res.redirect('/user');
            }
        );
    } else {
        res.redirect(req.session.login);
    }
});

app.get('/user', (req, res) => {
    console.log(req.session);
    request.get(
        {
            url: 'https://api.github.com/user',
            headers: {
                Authorization: 'token ' + req.session.access_token,
                'User-Agent': 'Login-App'
            }
        },
        (error, response, body) => {
            var obj = eval("(" + body + ")");
            req.session.name = obj.login;
            req.session.user_id= obj.id;
	    req.session.dir = process.cwd()+"/save/"+obj.login+"/web";
            req.session.compile_dir = process.cwd()+"/save/"+obj.login;
	    mkdirp(req.session.compile_dir, function (err) {
		    if (err)
		        console.error(err);
            });
	    console.log("dir : "+req.session.dir);
            res.redirect(req.session.login); // /web or /compile
        }
    );
});

app.get('/logout', (req, res) => {
    var login = req.session.login;
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect(login);
        }
    })
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('node compiler v0.2 active on port ' + app.get('port'));
});

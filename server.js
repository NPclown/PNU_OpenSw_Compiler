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
var cp = require("fs-extra");
var fb = require('./web.js');
var py = require('python-shell');

var child = child_process.fork(__dirname + '/compile.js');
var taskId = 0;
var tasks = {};
var maxQueue = 10; // menentukan seberapa banyak queue yang bisa dilayani oleh satu server
var redirect_uri = 'http://127.0.0.1:3000/auth/github/callback';

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
                cp.copy('sample_source/web', req.session.dir, function (err) {
                    if (err) return console.error(err)
                    console.log('success!')
                });
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

app.get('/input_window', function (req, res) {
    res.render('input_window.ejs');
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

app.get('/c_developer', function (req, res) {
    req.session.login = '/c_developer';
    console.log("web is called" + req.session.c_dir)
    console.log("first call session.name is " + req.session.name)
    if(req.session.name !== undefined ) {
        fs.access(req.session.c_dir, error =>{
            if (error){
                cp.copy('sample_source/c_developer', req.session.c_dir, function (err) {
                    if (err) return console.error(err)
                    console.log('success!')
                });
            }
        })
    }

    if(req.session.name !== undefined)
        fb.setcwd(req.session.c_dir, argv.include, argv.exclude);
    else
        fb.setcwd(process.cwd(), argv.include, argv.exclude);

    res.render("index_c_developer.ejs", {
        title: req.session.title,
        name: req.session.name,
        user_id: req.session.user_id
    });
});

app.get('/java_developer', function (req, res) {
    req.session.login = '/java_developer';
    console.log("web is called" + req.session.java_dir)
    console.log("first call session.name is " + req.session.name)
    if(req.session.name !== undefined ) {
        fs.access(req.session.java_dir, error =>{
            if (error){
                cp.copy('sample_source/java_developer', req.session.java_dir, function (err) {
                    if (err) return console.error(err)
                    console.log('success!')
                });
            }
        })
    }

    if(req.session.name !== undefined)
        fb.setcwd(req.session.java_dir, argv.include, argv.exclude);
    else
        fb.setcwd(process.cwd(), argv.include, argv.exclude);

    res.render("index_java_developer.ejs", {
        title: req.session.title,
        name: req.session.name,
        user_id: req.session.user_id
    });
});


//index_c_developer 관련
app.post("/api/make", function (req, res){
    var message = {
        dir : req.session.c_dir,
        inputs : req.body.inputs,
        runName : req.body.runName
    }
    console.log(message);
    var options = {
            mode: 'text',
            pythonPath: '/usr/bin/python',
            pythonOptions: ['-u'],
            scriptPath: 'python/',
            args: [JSON.stringify(message)]
    };

    console.log(options);
    py.PythonShell.run('c_developer.py',options,function(err, results){
            if(err) throw err;
            console.log(results);
            var obj = eval("("+results+")");
            if (results == null){
                    res.send({result:"server error",timeExec: 0, success:true, id:message.id});
            }
            switch(obj.state){
                    case "success":
                            res.send({result:obj.stdout,timeExec: obj.runningTime, success:true, id:message.id});
                            break;
                    case "make error":
                            res.send({result:obj.stderr,timeExec: obj.runningTime, success:true, id:message.id});
                            break;
                    case "tle":
                            sh("docker rm -f " + obj.containerId);
                            res.send({result:obj.stderr,timeExec: 0, success:true, id:message.id});			
                            break;
                    case "error":
                            res.send({result:obj.stderr,timeExec: obj.runningTime, success:true, id:message.id});
                            break;
                    default:
                            res.send({result:"server error",timeExec: 0, success:true, id:message.id});
            }
    }); 

});

//index_c_developer 관련
app.post("/api/java", function (req, res){
    var message = {
        dir : req.session.java_dir,
        inputs : req.body.inputs
    }
    console.log(message);
    var options = {
            mode: 'text',
            pythonPath: '/usr/bin/python',
            pythonOptions: ['-u'],
            scriptPath: 'python/',
            args: [JSON.stringify(message)]
    };

    console.log(options);
    py.PythonShell.run('java_developer.py',options,function(err, results){
            if(err) throw err;
            console.log(results);
            var obj = eval("("+results+")");
            if (results == null){
                    res.send({result:"server error",timeExec: 0, success:true, id:message.id});
            }
            switch(obj.state){
                    case "success":
                            res.send({result:obj.stdout+obj.stderr,timeExec: obj.runningTime, success:true, id:message.id});
                            break;
                    case "compile error":
                            res.send({result:obj.stderr,timeExec: obj.runningTime, success:true, id:message.id});
                            break;
                    case "tle":
                            sh("docker rm -f " + obj.containerId);
                            res.send({result:obj.stderr,timeExec: 0, success:true, id:message.id});			
                            break;
                    case "error":
                            res.send({result:obj.stderr,timeExec: obj.runningTime, success:true, id:message.id});
                            break;
                    default:
                            res.send({result:"server error",timeExec: 0, success:true, id:message.id});
            }
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
    console.log('sudo docker run -d --name '+req.session.user_id+' -p '+ count_docker+':3000'+' -v '+req.session.dir+':/home/web/my-app qkrwlghddlek/ubuntu_react sh -c "cd /home/web/my-app; npm start"');
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
    console.log("file_path : " + req.body.file_path);
    console.log("login : " + req.session.login);
    var file_path;
    if (req.session.login == '/compile'){
        file_path = "save/"+req.session.name+"/"+req.body.file_path;
    }else if(req.session.login == '/web'){
        file_path = "save/"+req.session.name+"/"+"web"+"/"+req.body.file_path;
    }else if(req.session.login == '/c_developer'){
        file_path = "save/"+req.session.name+"/"+"c_developer"+"/"+req.body.file_path;
    }else if(req.session.login == '/java_developer'){
        file_path = "save/"+req.session.name+"/"+"java_developer"+"/"+req.body.file_path;
    }else{

    }

    console.log(file_path);
    fs.writeFile(file_path, dataString, "utf8", function (error) {
        if (error) {
            throw error
        }
        res.send({success: true});
    });
});

app.get('/api/create_file', function (req, res) {
    console.log("##create##");
    var file_path;

    if (req.session.login == '/compile'){
        file_path = "save/"+req.session.name+"/"+req.query.path;
    }else if(req.session.login == '/web'){
        file_path = "save/"+req.session.name+"/"+"web"+"/"+req.query.path;
    }else if(req.session.login == '/c_developer'){
        file_path = "save/"+req.session.name+"/"+"c_developer"+"/"+req.query.path;
    }else if(req.session.login == '/java_developer'){
        file_path = "save/"+req.session.name+"/"+"java_developer"+"/"+req.query.path;
    }else{

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

app.get('/api/create_folder', function (req, res) {
    console.log("##create##");
    var file_path;
    if (req.session.login == '/compile'){
        file_path = "save/"+req.session.name+"/"+req.query.path;
    }else if(req.session.login == '/web'){
        file_path = "save/"+req.session.name+"/"+"web"+"/"+req.query.path;
    }else if(req.session.login == '/c_developer'){
        file_path = "save/"+req.session.name+"/"+"c_developer"+"/"+req.query.path;
    }else if(req.session.login == '/java_developer'){
        file_path = "save/"+req.session.name+"/"+"java_developer"+"/"+req.query.path;
    }else{

    }

    mkdirp(file_path, function (err) {
        if (err)
            console.error(err);
    });
});

app.get('/api/down_file', function (req, res) {
    console.log("##download##");
    var file_path;
    if (req.session.login == '/compile'){
        file_path = "save/"+req.session.name+"/"+req.query.path;
    }else if(req.session.login == '/web'){
        file_path = "save/"+req.session.name+"/"+"web"+"/"+req.query.path;
    }else if(req.session.login == '/c_developer'){
        file_path = "save/"+req.session.name+"/"+"c_developer"+"/"+req.query.path;
    }else if(req.session.login == '/java_developer'){
        file_path = "save/"+req.session.name+"/"+"java_developer"+"/"+req.query.path;
    }else{

    }
    console.log("D:/git/final_pnu/"+file_path);
    res.download(file_path);
});


app.get('/api/delete_file', function (req, res) {
    console.log("##delete##");
    var file_path;
    if (req.session.login == '/compile'){
        file_path = "save/"+req.session.name+"/"+req.query.path;
    }else if(req.session.login == '/web'){
        file_path = "save/"+req.session.name+"/"+"web"+"/"+req.query.path;
    }else if(req.session.login == '/c_developer'){
        file_path = "save/"+req.session.name+"/"+"c_developer"+"/"+req.query.path;
    }else if(req.session.login == '/java_developer'){
        file_path = "save/"+req.session.name+"/"+"java_developer"+"/"+req.query.path;
    }else{

    }
    console.log("file_path : " + file_path);
	fs.lstat(file_path, (err, stats) => {
        if(err)
            return console.log(err); //Handle error

        if(`${stats.isDirectory()}` == "true"){
            console.log("that is dir");
            fs.rmdir(file_path, function (error) {
                if (error) {
                    console.log("no file " + error)
                };
                res.send({success: true});
            });
        }

        if(`${stats.isFile()}` == "true") {
            console.log("that is file")
            fs.unlink(file_path, function (error) {
                if (error) {
                    console.log("no file " + error)
                };
                res.send({success: true});
            });
        }
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
            client_id: '082085f52792544c7616',
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
                        client_id: '082085f52792544c7616',
                        client_secret: 'e09cf9c4ad40601e3271083e0e4c959d2a1d7784',
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
            req.session.c_dir = process.cwd()+"/save/"+obj.login+"/c_developer";
            req.session.java_dir = process.cwd()+"/save/"+obj.login+"/java_developer";
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

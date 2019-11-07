
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var child_process = require('child_process');
var Sync = require('sync');
var request = require('request');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
// if ('development' == app.get('env')) {
//   app.use(express.errorHandler());
// }

var child = child_process.fork(__dirname + '/compile.js');

var taskId = 0;
var tasks = {};
var maxQueue = 10; // menentukan seberapa banyak queue yang bisa dilayani oleh satu server

function addTask(data, callback) {
    // taskId++;
    // if (taskId > 10) taskId = 1;
    Sync(function() {
        taskId++;
        if (taskId > maxQueue) taskId = 1;
    
        child.send({id: taskId, script:data.script, inputs:data.inputs, language: data.language, options:data.options});
    
        tasks[taskId] = callback;
    });
}

child.on('message', function(message) {
    // Look up the callback bound to this id and invoke it with the result
    // console.log(message);
    tasks[message.id](message);
});

app.get('/', function(req, res) {
    res.send("node compiler v0.2");
});

app.get('/compile', function(req, res) {
    res.render("index.ejs");
});

app.get('/compile/c_language',function(req, res){
    res.render("c_language.ejs");
});

app.get('/compile/c_language_clang',function(req, res){
    res.render("c_language_clang.ejs");
});


app.get('/compile/cpp_language',function(req, res){
    res.render("cpp_language.ejs");
});


app.get('/compile/cpp11_language',function(req, res){
    res.render("cpp11_language.ejs");
});


app.get('/compile/cpp_language_clang',function(req, res){
    res.render("cpp_language_clang.ejs");
});

app.get('/compile/java_language',function(req, res){
    res.render("java_language.ejs");
});

app.get('/compile/python_language',function(req, res){
    res.render("python_language.ejs");
});

app.get('/compile/python3_language',function(req, res){
    res.render("python3_language.ejs");
});

app.get('/compile/bash_language',function(req, res){
    res.render("bash_language.ejs");
});

app.get('/compile/perl_language',function(req, res){
    res.render("perl_language.ejs");
});

app.get('/compile/nodejs_language',function(req, res){
    res.render("nodejs_language.ejs");
});

app.get('/compile/r_language',function(req, res){
    res.render("r_language.ejs");
});

app.get('/compile/csharp_language',function(req, res){
    res.render("csharp_language.ejs");
});

app.get('/compile/object_c_language',function(req, res){
    res.render("object_c_language.ejs");
});

app.get('/compile/object_cpp_language',function(req, res){
    res.render("object_cpp_language.ejs");
});

app.post('/api/compile', function(req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    console.log("###body###");
    console.log(req.body);
    var options = req.body.options;             // 컴파일 옵션
    var script = req.body.dataString;           // 소스코드
    var inputs = req.body.inputs;               // 인자값
    var language = req.body.language;           // 언어 종류
    console.log(language);
    // child.js에 인자 넘기기
    addTask({script: script, inputs:inputs, language: language, options:options}, function(result) {
        console.log("###result###");
        console.log(result);
        res.json(result);
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('node compiler v0.2 active on port ' + app.get('port'));
});

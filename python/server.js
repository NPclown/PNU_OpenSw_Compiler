var py = require('python-shell');

var targetSource = '#include<stdio.h> int main() { printf("Hello World!");  return 0;}'
var languageCode = '1'
var targetInput = 'test'

var options = {
        mode: 'text',
        pythonPath: '/usr/bin/python',
        pythonOptions: ['-u'],
        scriptPath: 'python/',
        args: [languageCode,targetSource,targetInput]
}

py.PythonShell.run('server.py',options,function(err, results){
        if(err) throw err;
        console.log(results);
});
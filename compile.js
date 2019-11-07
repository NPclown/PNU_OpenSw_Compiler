var py = require('python-shell');
var sh = require('sync-exec');

process.on('message', function(message){
	//Process data
	//
	var options = {
        	mode: 'text',
        	pythonPath: '/usr/bin/python',
        	pythonOptions: ['-u'],
       	 	scriptPath: 'python/',
        	args: [JSON.stringify(message)]
	};

	py.PythonShell.run('server.py',options,function(err, results){
        	if(err) throw err;
       		console.log(results);
		var obj = eval("("+results+")");
		if (results == null){
			process.send({result:"server error",timeExec: 0, success:true, id:message.id});
		}
		switch(obj.state){
			case "success":
				process.send({result:obj.stdout,timeExec: obj.runningTime, success:true, id:message.id});
				break;
			case "compile error":
				process.send({result:obj.stderr,timeExec: obj.runningTime, success:true, id:message.id});
				break;
			case "tle":
				sh("docker rm -f " + obj.containerId);
				process.send({result:obj.stderr,timeExec: 0, success:true, id:message.id});			
				break;
			case "error":
				process.send({result:obj.stderr,timeExec: obj.runningTime, success:true, id:message.id});
				break;
                        default:
                                process.send({result:"server error",timeExec: 0, success:true, id:message.id});
		}
	});
});

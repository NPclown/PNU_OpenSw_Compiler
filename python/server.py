#-*- coding: utf8 -*-
import sys
import tempfile
import time
import os
import logging
import datetime
import shutil
import json

#configure compile/run fuctions and arguments
from languageConfigure import *


def getFromDict(key, json_data, default='', errorMessage = None, logger = None):
    if key not in json_data:
        if errorMessage is not None:
            if logger is None:
                print errorMessage
            else:
                logger.error(errorMessage)
            print "error"
            return None
        return default
    return json_data[key]


#Configure logger
logger = logging.getLogger('sever')
logger.setLevel(logging.DEBUG)

#make logfile directory
if not os.path.exists('log'):
    os.makedirs('log')
fileHandler = logging.FileHandler('log/server_' + datetime.datetime.now().strftime('%Y%m%d%H%M%S') + '.log')
fileHandler.setLevel(logging.WARNING)

consoleHandler = logging.StreamHandler()
consoleHandler.setLevel(logging.DEBUG)

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
fileHandler.setFormatter(formatter)
consoleHandler.setFormatter(formatter)

logger.addHandler(fileHandler)
logger.addHandler(consoleHandler)


json_data = json.loads(sys.argv[1])

memorySwapLimit=100

try:
    #Get file type
    filetype = getFromDict(key='filetype', json_data=json_data, errorMessage='No file type', logger=logger)
    #Get file name
    fileName = fileNAME[filetype]
    #Get source code
    sourceCode = getFromDict(key='script', json_data=json_data, errorMessage='No source code', logger=logger)
    if sourceCode is None:
        sys.exit()

    #Get stdin string
    stdin = getFromDict(key='inputs', json_data=json_data, default='')

    #Get running time limit
    try:
        runningTimeLimit = int(getFromDict(key='time_limit', json_data=json_data, default=5))
    except ValueError as verr:
        logger.error('running time limit value error. ' + str(e))
	print "Running time limit value is not an acceptable form. It should be only a integer."
	sys.exit()
    except Exception as e:
        logger.critical(str(e))
	print "Server error."
	sys.exit()

    #Get memory limit
    try:
        memoryLimit = int(getFromDict(key='memory_limit', json_data=json_data, default=128))

    except ValueError as verr:
        logger.error('memory limit value error. ' + str(e))
        sendResponse(conn, state='error', stdout='', stderr='Memory limit value is not an acceptable form.', logger=logger)
	print "Memory limit value is not an acceptable form."
	sys.exit()
    except Exception as e:
        logger.critical(str(e))
	print "Server error."
	sys.exit()

    #make temp directory
    try:
        dirpath = tempfile.mkdtemp()
    except Exception as e:
        logger.critical('Cannot write source code. ' + str(e))

    try:
        with open(dirpath + '/' + fileName, 'w') as fp:
            fp.write(sourceCode.encode('utf8'))
        #make the file to be redirected as stdin
        with open(dirpath + '/stdin.txt', 'w') as fp:
            fp.write(stdin.encode('utf8'))
    except Exception as e:
        logger.critical('Cannot write source code or stdin file. ' + str(e))

    #compile
    if filetype not in noCompileType:
        result = compileCallingFunction[filetype](
                sourceFile=[fileName], volumn = dirpath+':/data',
                logger=logger,
                **compileKwargs[filetype])

	if result['state'] != 'success':
        	logger.info('Run failed: ' + result['stderr'])
		print json.dumps(result)
		try:
    			shutil.rmtree(dirpath)
			sys.exit()
		except Exception as e:
    			logger.error('Cannot remove dir. (' + dirpath + ') ' + str(e))
 
    #run
    runName = 'a.out'
    if filetype == 'text/x-python':
        runName = "/data/"+fileName
    elif filetype == 'text/x-python3':
        runName = "/data/"+fileName
    elif filetype == 'text/x-java':
        runName = fileName[:fileName.rfind('.')]
    elif filetype == 'text/x-bash':
        runName = "/data/"+fileName
    elif filetype == 'text/x-perl':
        runName = "/data/"+fileName
    elif filetype == 'text/x-nodejs':
        runName = "/data/"+fileName
    elif filetype == 'text/x-csharp4':
        runName = "/data/test.exe"
    elif filetype == 'text/x-r':
        runName = "/data/"+fileName
    elif filetype == 'text/x-perl':
        runName = "/data/"+fileName

    result = runCallingFunction[filetype](
            runName = runName,
            stdinName = 'stdin.txt',
            volumn=dirpath+':/data', memoryLimit=memoryLimit, memorySwapLimit=memorySwapLimit,
            timeLimit = runningTimeLimit, logger = logger,
            **runKwargs[filetype]) 

    if result['state'] != 'success':
        logger.info('Run failed: ' + result['stderr'])
    
    print json.dumps(result)

    logger.info('Run success')

    try:
        shutil.rmtree(dirpath)
    except Exception as e:
        logger.error('Cannot remove dir. (' + dirpath + ') ' + str(e))
        
       
except Exception as e:
    logger.critical('Unknown exception.s ' + str(e))
       


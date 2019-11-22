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
import dockerContainer


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
timeLimit=10

try:
    #make temp directory
    dirpath = getFromDict(key='dir', json_data=json_data, default='')
    volumn = dirpath+":/data"

    #Get stdin string
    try:
	stdin = getFromDict(key='inputs', json_data=json_data, default='')
	with open(dirpath+'/stdin.txt', 'w') as fp:
	    fp.write(stdin.encode('utf8'))
    except Exception as e:
	logger.critical('Cannot write stdin file.' + str(e))


    #compile
    command = "-v %s npclown/java:1.0 sh -c 'cd /data; find ./src -name *.java > sources_list.txt; javac -cp . -d class @sources_list.txt'" % (volumn)
    logger.debug(command)
    D = dockerContainer.execute(command, timeLimit, logger)
    #print D
    exitCode = D['exitcode']
    if logger is not None:
        logger.info('Compile done. (exit code: %s)' % str(exitCode))
    
    res = {}
    if exitCode == 0:
        res['state'] = 'success'
        res['stdout'] = D['stdout']
        res['stderr'] = D['stderr']
	res['runningTime'] = D['runningTime']
    elif exitCode == 1:
        res['state'] = 'compile error'
        res['stdout'] = D['stdout']
        res['stderr'] = D['stderr']
	res['runningTime'] = D['runningTime']
    elif exitCode == 2:
        res['state'] = 'make error'
        res['stdout'] = D['stdout']
        res['stderr'] = D['stderr']
	res['runningTime'] = D['runningTime']
    elif D['state'] == 'tle':
        res['state'] = 'tle'
        res['stdout'] = ''
        res['stderr'] = 'Compile time limit exceeded.'
	res['runningTime'] = D['runningTime']
    else:
        res['state'] = 'error'
        res['stdout'] = ''
        res['stderr'] = 'Server error.'
	res['runningTime'] = D['runningTime']
    if logger is not None:
        logger.critical('Error while compile: ' + D['stderr'])
    else:
        print 'Error while compile: ' + D['stderr']

    if res['state'] != 'success':
        print json.dumps(res)
        sys.exit();
 
    #run
    command = "-v %s npclown/java:1.0 sh -c 'cd /data; java -cp ./class Main < stdin.txt; rm -rf *.txt'" % (volumn)

    D = dockerContainer.execute(command, timeLimit, logger)
    logger.debug(command)
    exitCode = D['exitcode']
    if logger is not None:
        logger.info('Run done. (exit code: %s)' % str(exitCode))

    res = {}
    if exitCode == 0:
        res['state'] = 'success'
        res['stdout'] = D['stdout']
        res['stderr'] = D['stderr']
	res['runningTime'] = D['runningTime']
    elif D['state'] == 'tle':
        res['state'] = 'tle'
        res['stdout'] = ''
        res['stderr'] = 'Running time limit exceeded.'
	res['runningTime'] = ''
	res['containerId'] = D['ContainerId']
    elif exitCode == 137:
        res['state'] = 'error'
        res['stdout'] = ''
        res['stderr'] = 'Memory limit exceeded.'
	res['runningTime'] = ''
    elif 'docker' not in D['stderr']:
        res['state'] = 'error'
        res['stdout'] = D['stdout']
        res['stderr'] = D['stderr']
	res['runningTime'] = ''
        if logger is not None:
            logger.info('Exception while running(may due to user): ' + res['stderr'])
    else:
        res['state'] = 'error'
        res['stdout'] = ''
        res['stderr'] = 'Server error.'
	res['runningTime'] = D['runningTime']
        if logger is not None:
            logger.critical('Error while running: ' + res['stderr'])
        else:
            print 'Error while running: ' + res['stderr']
   
    print json.dumps(res)

    logger.info('Run success')
       
       
except Exception as e:
    logger.critical('Unknown exception.s ' + str(e))
       


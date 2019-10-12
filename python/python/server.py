#-*- coding: utf8 -*-
import sys
import tempfile
import time
import os
import logging
import datetime
import shutil

#configure compile/run fuctions and arguments
from languageConfigure import *


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

fileName = "test.c"
filetype = "text/x-csrc"

    try:
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
                sendResponse(conn, state=result['state'], stdout=result['stdout'], stderr=result['stderr'], logger=logger)
                conn.close()
                continue

            if stage == 'compile':
                try:
                    shutil.rmtree(dirpath)
                except Exception as e:
                    logger.error('Cannot remove dir. (' + dirpath + ') ' + str(e))
                    logger.info('Compile success')
                    sendResponse(conn, state='success', stdout=result['stdout'], stderr=result['stderr'], logger=logger)
                    conn.close()
                    continue
                sendResponse(conn, state='success', stdout=result['stdout'], stderr=result['stderr'], logger = logger)
                conn.close()
                continue

            binaryName = getFromDict(D=compileKwargs[filetype], key='binaryName', default=None)
            if binaryName is None:
                binaryName = fileName[:fileName.rfind('.')] + '.class'
            print ' >', binaryName

            #Block until file writing done
            if not isFileWritingDone(dirpath+'/'+binaryName,
                    checkXMode=ifTheBinaryFileNeedsXMode[filetype],
                    blockTimeLimit=2):
                logger.critical('Cannot write binary file.')
                sendResponse(conn, state='error', stdout='', stderr='Server error.', logger=logger)
                conn.close()
                continue

        #run
        runName = 'a.out'
        if filetype == 'text/x-python':
            runName = '/data/'+fileName
        elif filetype == 'text/x-java':
            runName = fileName[:fileName.rfind('.')]
        result = runCallingFunction[filetype](
                runName = runName,
                stdinName = 'stdin.txt',
                volumn=dirpath+':/data', memoryLimit=memoryLimit, memorySwapLimit=memorySwapLimit,
                timeLimit = runningTimeLimit, logger = logger,
                **runKwargs[filetype])

        if result['state'] != 'success':
            logger.info('Run failed: ' + result['stderr'])
            sendResponse(conn, state=result['state'], stdout=result['stdout'], stderr=result['stderr'], logger=logger)
            conn.close()
            continue

        logger.info('Run success')
        sendResponse(conn, state='success', stdout=result['stdout'], stderr=result['stderr'], logger=logger)
        conn.close()

    except Exception as e:
        logger.critical('Unknown exception.s ' + str(e))
        if conn:
            sendResponse(conn, state='error', stdout='', stderr='Server error.', logger=logger)
    try:
        shutil.rmtree(dirpath)
    except Exception as e:
        logger.error('Cannot remove dir. (' + dirpath + ') ' + str(e))
        if conn:
            sendResponse(conn, state='success', stdout=result['stdout'], stderr=result['stderr'], logger=logger)
            conn.close()

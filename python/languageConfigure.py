#-*- coding: utf8 -*-
import compileLanguage
import interpreterLanguage
import time
import os
import stat

supportType = ['text/x-c++src', 'text/x-csrc', 'text/x-python', 'text/x-java']
#mime list for the languages that do not need compile:
noCompileType = ['text/x-python','text/x-python3','text/x-bash','text/x-perl','text/x-nodejs','text/x-r','text/x-perl']

fileNAME = {
'text/x-c++src' : "test.cc", 
'text/x-c++src(clang)' : "test.cc", 
'text/x-c++11src' : "test.cc", 
'text/x-csrc' : "test.c",
'text/x-csrc(clang)' : "test.c",
'text/x-python' : "test.py",
'text/x-python3' : "test.py",
'text/x-java' : "test.java",
'text/x-bash' : "test.sh",
'text/x-perl' : "test.pl",
'text/x-nodejs' : "test.js",
'text/x-object-c' : "test.m",
'text/x-object-c++' : "test.mm",
'text/x-csharp4' : "test.cs",
'text/x-r' : "test.r",
'text/x-perl' : "test.pl"
}

compileCallingFunction = {
    'text/x-c++src': compileLanguage.compile,
    'text/x-c++11src': compileLanguage.compile,
    'text/x-csrc': compileLanguage.compile,
    'text/x-c++src(clang)': compileLanguage.compile,
    'text/x-csrc(clang)': compileLanguage.compile,
    'text/x-java': compileLanguage.compile,
    'text/x-object-c': compileLanguage.compile,
    'text/x-object-c++': compileLanguage.compile,
    'text/x-csharp4': compileLanguage.compile
}
compileKwargs = {
    'text/x-c++src': {
        'compilerName': 'g++',
        'option': '-O2 -Wall -lm --static -DONLINE_JUDGE',
        'binaryName': 'a.out',
        'imageName': 'npclown/gcc:1.0'
    },
    'text/x-c++11src': {
        'compilerName': 'g++',
        'option': '-O2 -Wall -lm --static -std=c++11 -DONLINE_JUDGE',
        'binaryName': 'a.out',
        'imageName': 'npclown/gcc:1.0'
    },
    'text/x-csrc':{
        'compilerName': 'gcc',
        'option': '-O2 -Wall -lm --static -std=gnu99 -DONLINE_JUDGE',
        'binaryName': 'a.out',
        'imageName': 'npclown/gcc:1.0'
    },
    'text/x-c++src(clang)': {
        'compilerName': 'clang++',
        'option': '-O2 -Wall -std=c++11 -DONLINE_JUDGE',
        'binaryName': 'a.out',
        'imageName': 'npclown/clang:1.0'
    },
    'text/x-csrc(clang)':{
        'compilerName': 'clang',
        'option': '-O2 -Wall -DONLINE_JUDGE -std=c99',
        'binaryName': 'a.out',
        'imageName': 'npclown/clang:1.0'
    },
    'text/x-java': {
        'compilerName': 'javac',
        'option': '-encoding UTF-8 -d /data',
        'binaryName': None,
        'imageName': 'npclown/java:1.0'
    },
    'text/x-object-c': {
        'compilerName': 'gcc',
        'option': '-I/usr/include/GNUstep -L/usr/lib/GNUstep -lobjc -lgnustep-base -Wall -std=c99',
        'binaryName': 'a.out',
        'imageName': 'npclown/object-c:1.0'
    },
    'text/x-object-c++': {
        'compilerName': 'g++',
        'option': '-I/usr/include/GNUstep -L/usr/lib/GNUstep -lobjc -lgnustep-base -Wall',
        'binaryName': 'a.out',
        'imageName': 'npclown/object-c:1.0'
    },
    'text/x-csharp4': {
        'compilerName': 'dmcs',
        'option': '-warn:0 -optimize+ -reference:System.Numerics.dll',
        'binaryName': None,
        'imageName': 'npclown/csharp:1.0'
    }
}

runCallingFunction = {
    'text/x-c++src': compileLanguage.run,
    'text/x-c++11src': compileLanguage.run,
    'text/x-csrc': compileLanguage.run,
    'text/x-c++src(clang)': compileLanguage.run,
    'text/x-csrc(clang)': compileLanguage.run,
    'text/x-object-c': compileLanguage.run,
    'text/x-object-c++': compileLanguage.run,
    'text/x-csharp4': interpreterLanguage.run,
    'text/x-nodejs': interpreterLanguage.run,
    'text/x-java': interpreterLanguage.run,
    'text/x-python': interpreterLanguage.run,
    'text/x-python3': interpreterLanguage.run,
    'text/x-perl' : interpreterLanguage.run,
    'text/x-bash' : interpreterLanguage.run,
    'text/x-r' : interpreterLanguage.run,
    'text/x-perl' : interpreterLanguage.run
}
runKwargs = {
    'text/x-c++src': {
        'imageName': 'npclown/gcc:1.0'
    },
    'text/x-c++11src': {
        'imageName': 'npclown/gcc:1.0'
    },
    'text/x-csrc': {
        'imageName': 'npclown/gcc:1.0'
    },
    'text/x-c++src(clang)': {
        'imageName': 'npclown/clang:1.0'
    },
    'text/x-csrc(clang)': {
        'imageName': 'npclown/clang:1.0'
    },
    'text/x-python': { 
	'intpName': 'python',
        'imageName': 'npclown/gcc:1.0'
    },
    'text/x-python3': { 
	'intpName': 'python3',
        'imageName': 'npclown/gcc:1.0'
    },
    'text/x-java': {
        'option': '-Dfile.encoding=UTF-8 -classpath /data',
        'intpName': 'java',
        'imageName': 'npclown/java:1.0'
    },
    'text/x-bash' : {
        'intpName': 'bash',
	'imageName' : 'npclown/gcc:1.0'
    },
    'text/x-perl' : {
        'intpName': 'perl',
	'imageName' : 'npclown/perl:1.0'
    },
    'text/x-nodejs' : {
        'intpName': 'node',
	'imageName' : 'npclown/nodejs:1.0'
    },
    'text/x-object-c' : {
	'imageName' : 'npclown/object-c:1.0'
    },
    'text/x-object-c++' : {
	'imageName' : 'npclown/object-c:1.0'
    },
    'text/x-csharp4' : {
        'intpName': 'mono',
	'imageName' : 'npclown/csharp:1.0'
    },
    'text/x-r' : {
        'intpName': 'Rscript',
	'imageName' : 'npclown/language-r:1.0'
    },
    'text/x-perl' : {
        'intpName': 'perl6',
	'imageName' : 'npclown/perl:1.0'
    }
}
ifTheBinaryFileNeedsXMode = {
    'text/x-c++src': True,
    'text/x-csrc': True,
    'text/x-java': False
}

def isFileWritingDone(fileName, checkXMode = False, blockTimeLimit = 2):
    #Block until file writing done
    start = time.time()
    while not(os.path.isfile(fileName) and (checkXMode == False or bool(os.stat(fileName).st_mode & stat.S_IXUSR))):
        #no more than 2 secs
        if time.time() > start + blockTimeLimit:
            return False
        time.sleep(0.1)
    return True

def runNAME(fileName):
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

    return runName



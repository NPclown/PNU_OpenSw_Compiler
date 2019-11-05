#-*- coding: utf8 -*-
import compileLanguage
import interpreterLanguage
import time
import os
import stat

supportType = ['C++', 'C', 'python', 'java']
#mime list for the languages that do not need compile:
noCompileType = ['python','python3','bash','perl','nodejs','R','perl']

fileNAME = {
'C++' : "test.cc", 
'C++(clang)' : "test.cc", 
'C++11' : "test.cc", 
'C' : "test.c",
'C(clang)' : "test.c",
'python' : "test.py",
'python3' : "test.py",
'java' : "test.java",
'bash' : "test.sh",
'perl' : "test.pl",
'nodejs' : "test.js",
'object-c' : "test.m",
'object-c++' : "test.mm",
'csharp' : "test.cs",
'R' : "test.r",
'perl' : "test.pl"
}

compileCallingFunction = {
    'C++': compileLanguage.compile,
    'C++11': compileLanguage.compile,
    'C': compileLanguage.compile,
    'C++(clang)': compileLanguage.compile,
    'C(clang)': compileLanguage.compile,
    'java': compileLanguage.compile,
    'object-c': compileLanguage.compile,
    'object-c++': compileLanguage.compile,
    'csharp': compileLanguage.compile
}
compileKwargs = {
    'C++': {
        'compilerName': 'g++',
        'option': '-O2 -Wall -lm --static -DONLINE_JUDGE',
        'binaryName': 'a.out',
        'imageName': 'npclown/gcc:1.0'
    },
    'C++11': {
        'compilerName': 'g++',
        'option': '-O2 -Wall -lm --static -std=c++11 -DONLINE_JUDGE',
        'binaryName': 'a.out',
        'imageName': 'npclown/gcc:1.0'
    },
    'C':{
        'compilerName': 'gcc',
        'option': '-O2 -Wall -lm --static -std=gnu99 -DONLINE_JUDGE',
        'binaryName': 'a.out',
        'imageName': 'npclown/gcc:1.0'
    },
    'C++(clang)': {
        'compilerName': 'clang++',
        'option': '-O2 -Wall -std=c++11 -DONLINE_JUDGE',
        'binaryName': 'a.out',
        'imageName': 'npclown/clang:1.0'
    },
    'C(clang)':{
        'compilerName': 'clang',
        'option': '-O2 -Wall -DONLINE_JUDGE -std=c99',
        'binaryName': 'a.out',
        'imageName': 'npclown/clang:1.0'
    },
    'java': {
        'compilerName': 'javac',
        'option': '-encoding UTF-8 -d /data',
        'binaryName': None,
        'imageName': 'npclown/java:1.0'
    },
    'object-c': {
        'compilerName': 'gcc',
        'option': '-I/usr/include/GNUstep -L/usr/lib/GNUstep -lobjc -lgnustep-base -Wall -std=c99',
        'binaryName': 'a.out',
        'imageName': 'npclown/object-c:1.0'
    },
    'object-c++': {
        'compilerName': 'g++',
        'option': '-I/usr/include/GNUstep -L/usr/lib/GNUstep -lobjc -lgnustep-base -Wall',
        'binaryName': 'a.out',
        'imageName': 'npclown/object-c:1.0'
    },
    'csharp': {
        'compilerName': 'dmcs',
        'option': '-warn:0 -optimize+ -reference:System.Numerics.dll',
        'binaryName': None,
        'imageName': 'npclown/csharp:1.0'
    }
}

runCallingFunction = {
    'C++': compileLanguage.run,
    'C++11': compileLanguage.run,
    'C': compileLanguage.run,
    'C++(clang)': compileLanguage.run,
    'C(clang)': compileLanguage.run,
    'object-c': compileLanguage.run,
    'object-c++': compileLanguage.run,
    'csharp': interpreterLanguage.run,
    'nodejs': interpreterLanguage.run,
    'java': interpreterLanguage.run,
    'python': interpreterLanguage.run,
    'python3': interpreterLanguage.run,
    'perl' : interpreterLanguage.run,
    'bash' : interpreterLanguage.run,
    'r' : interpreterLanguage.run,
    'perl' : interpreterLanguage.run
}
runKwargs = {
    'C++': {
        'imageName': 'npclown/gcc:1.0'
    },
    'C++11': {
        'imageName': 'npclown/gcc:1.0'
    },
    'C': {
        'imageName': 'npclown/gcc:1.0'
    },
    'C++(clang)': {
        'imageName': 'npclown/clang:1.0'
    },
    'C(clang)': {
        'imageName': 'npclown/clang:1.0'
    },
    'python': { 
	'intpName': 'python',
        'imageName': 'npclown/gcc:1.0'
    },
    'python3': { 
	'intpName': 'python3',
        'imageName': 'npclown/gcc:1.0'
    },
    'java': {
        'option': '-Dfile.encoding=UTF-8 -classpath /data',
        'intpName': 'java',
        'imageName': 'npclown/java:1.0'
    },
    'bash' : {
        'intpName': 'bash',
	'imageName' : 'npclown/gcc:1.0'
    },
    'perl' : {
        'intpName': 'perl',
	'imageName' : 'npclown/perl:1.0'
    },
    'nodejs' : {
        'intpName': 'node',
	'imageName' : 'npclown/nodejs:1.0'
    },
    'object-c' : {
	'imageName' : 'npclown/object-c:1.0'
    },
    'object-c++' : {
	'imageName' : 'npclown/object-c:1.0'
    },
    'csharp' : {
        'intpName': 'mono',
	'imageName' : 'npclown/csharp:1.0'
    },
    'R' : {
        'intpName': 'Rscript',
	'imageName' : 'npclown/language-r:1.0'
    },
    'perl' : {
        'intpName': 'perl6',
	'imageName' : 'npclown/perl:1.0'
    }
}
ifTheBinaryFileNeedsXMode = {
    'c++': True,
    'c': True,
    'java': False
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



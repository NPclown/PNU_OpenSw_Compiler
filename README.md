PNU_OpenSW_Compiler
==============
### 사양
1. nodejs 10.16.3 권장
2. Docker
3. Python 2.7 권장

### 설치

```console
$ git clone git@github.com:NPclown/PNU_OpenSW_Compiler.git
$ cd PNU_OpenSW_Compiler
$ npm install
```

### 도커 이미지 다운
```console
$ docker pull npclown/gcc:2.0
$ docker pull npclown/clang:1.0
$ docker pull npclown/java:1.0
$ docker pull npclown/perl:1.0
$ docker pull npclown/csharp:1.0
$ docker pull npclown/object-c:1.0
$ docker pull npclown/language-r:1.0
$ docker pull npclown/nodejs:1.0
$ docker pull qkrwlghddlek/ubuntu_react
```

### 실행
```console
$ npm start
```

### 테스트 환경
```
http:// localhost:3000/compile
http:// 127.0.0.1:3000/compile
```
___

### GitHub Login 연동

1. github.com -> Settings -> Developer settings -> OAuth Apps 생성
2. Cilent_ID , Client_Secret, Authorization callback URL 복사
3. Server.js 수정
```
var redirect_uri = Authorization callback URL(복사한 값);

client_id: Cilent_ID(복사한 값),
client_secret: Client_Secret(복사한 값),
code: code,
redirect_uri: redirect_uri,
```
___
### Docker API
Request(json)
> 'stage':'compile' or 'run'  
'mime': 'text/x-c++src', 'text/x-java', 'text/x-python'  
'filename': source file name  
'stdin': stdin 문자열  
'source': 소스코드 문자열  
'time_limit': running time limit, 초 단위 (없으면 5초)  
'memory_limit': memory limit, MByte 단위 (없으면 128MB)  
'memory_limit_strict': true or false. (없으면 false) true이면 memory_limit만큼만 할당.   
(memory swap size 제한) false이면 memory_limit의 두 배.(swap size)  

Response(json)
>'state': 'tle', 'error', 'compile error', 'success'  
'stdout': stdout  
'stderr': stderr  
___
## 참고
node-compiler : https://github.com/sonnylazuardi/node-compiler  
docker-images : https://github.com/Baekjoon/Dockerfiles  
docker-Api : https://github.com/Startlink/docker-sandbox-API  
___
## License

(The MIT License)

Copyright (c) 2013-2014 Sonny Lazuardi <sonnylazuardi@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

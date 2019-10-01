# PNU_OpenSW_Compiler


# 요구사항

    g++ compiler
           
    node.js
    

# 설치과정

- 서버에 node.js 와 gcc 컴파일러 설치

      apt-get install g++
    
- 프로젝트 디렉토리에서 cmd창 오픈 후 명령어 실행

      npm install
    
- 윈도우 환경이라면 server.js 파일에 다음 부분 수정 
  (child-win.js -> 윈도우 / child.js -> 리눅스)

      var child = child_process.fork(__dirname + '/child-win.js');

- run the server.js

      node server.js  or  npm start
      
    
# 테스트과정

     http://localhost:3000/compile
  
     http://127.0.0.1:3000/compile
     
   
# 실행구조(ComPile 버튼 누를 시)

  1. /script/test.cpp 형식으로 파일 저장
  
  2. /script/input.txt 형식으로 파일 저장
  
  3. g++ 컴파일을 이용해 컴파일 후 /scrpit/exe/test.exe 로 저장
  
  4. test.exe < input.txt로 파일 실행 후 결과를 response 해줌
  

# 추가 및 수정 사항

- 컴파일 오류 발생 시 출력

- Input 값 오류 발생 시 출력

- SandBox를 통한 Server 보호

- 다른 언어 컴파일 설치 및 컴파일 명령어 파악

- 실행시간, CPU 사용시간, 메모리값 확인 필요

- 기타 등등 생각나면 추가

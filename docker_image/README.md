# Docker 이미지 생성

      docker build -t USERID/IMAGE:TAG .    -> Dockerfile 필요


# Docker 이미지 다운로드

      docker pull npclown/gcc:2.0    -> compiler 모음 파일
     
# Docker 실행 방법

      docker run -i -t --name test npclown/gcc:2.0 /bin/bash
      -> 컨테이너 실행 후 /bin/bash 라는 명령어 실행
      
      docker run --name test -d -p 3000:3000 npclown/gcc:2.0
      -> 백그라운로 실행, 호스트의 3000포트와 컨테이너 3000포트 연결


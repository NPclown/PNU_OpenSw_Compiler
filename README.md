# Docker 이미지 다운로드

      docker pull npclown/compiler:1.0    -> compiler 모음 파일
      docker pull npclown/pnu_compiler:1:0  -> 스크립트 포함 파일
     
# Docker 실행 방법

      docker run -i -t --name test npclown/pnu_compiler:1.0 /bin/bash
      -> 컨테이너 실행 후 /bin/bash 라는 명령어 실행
      
      docker run --name test -d -p 3000:3000 npclown/pnu_compiler:1.0
      -> 백그라운로 실행, 호스트의 3000포트와 컨테이너 3000포트 연결

# 기타 궁금한 점

      https://www.slideshare.net/pyrasis/docker-fordummies-44424016
  

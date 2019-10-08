FROM npclown/compiler:1.0
MAINTAINER PNU pnu pnu@pnu.com

ADD PNU_OpenSW_Compiler PNU_Project
WORKDIR /PNU_Project


RUN npm install

CMD ["node","server.js"]

EXPOSE 3000
EXPOSE 443 

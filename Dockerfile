FROM ubuntu:16.04
MAINTAINER PNU pnu pnu@pnu.com


RUN apt-get update
RUN apt-get install -y gcc g++ curl build-essential libssl-dev

ENV NVM_DIR=/root/.nvm
ENV NODE_VERSION=12.6.0

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash

RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version


ADD PNU_OpenSW_Compiler-master PNU_Project
WORKDIR /PNU_Project


RUN npm install

CMD ["node","server.js"]

EXPOSE 3000
EXPOSE 443 

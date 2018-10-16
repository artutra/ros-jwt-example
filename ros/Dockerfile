FROM node:8.11.1

RUN apt-get update
RUN apt-get install --yes curl
RUN apt-get install --yes build-essential libssl-dev
RUN apt-get install --yes python
# RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
# # RUN source ~/.profile
# RUN npm install -g node-gyp
# RUN npm install -g realm-object-server

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

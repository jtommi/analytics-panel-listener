FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force && rm -rf /tmp/*

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]

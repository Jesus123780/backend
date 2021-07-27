# stage1 - build react app first 
FROM node:14.16.0-alpine3.10 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json /app/
RUN npm install --force -y
COPY . /app
RUN npm install pm2 -g
CMD ["pm2-runtime", "src/App.js"]

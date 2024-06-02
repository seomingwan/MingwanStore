FROM nginx:latest

WORKDIR /usr/share/nginx/html

RUN apt-get update
RUN apt-get install nodejs npm -y
RUN npm install pm2 -g

# CMD [ "pm2-runtime", "start", "ecosystem.config.js" ]

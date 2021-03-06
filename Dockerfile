FROM node:6
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
ENTRYPOINT [ "npm" ]
CMD [ "start" ]

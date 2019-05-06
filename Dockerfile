FROM node:8

ENV APP_HOME /usr/local/app
ENV PATH $APP_HOME/bin:$PATH
RUN mkdir -p "$APP_HOME"
WORKDIR $APP_HOME

ENV NODE_PORT 8888
ADD . $APP_HOME

RUN npm set registry http://gitlab.zoesoft.com.cn:7001; \
    npm set disturl https://npm.taobao.org/dist; \
    npm set sass-binary-site http://npm.taobao.org/mirrors/node-sass

RUN npm install; \
    npm run build

EXPOSE 3001

CMD ["npm", "start"]

FROM node:20-alpine
RUN apk add g++ make cmake python3 --no-cache

ENV NODE_ENV=production

WORKDIR /myspeed

COPY ./client ./client
COPY ./server ./server
COPY ./package.json ./package.json

RUN npm install
RUN cd client && npm install --force
RUN npm run build
RUN mv /myspeed/client/build /myspeed
RUN rm -rf /myspeed/client

VOLUME ["/myspeed/data"]

EXPOSE 5216

CMD ["node", "server"]
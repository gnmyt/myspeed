FROM node:16-alpine
RUN apk add g++ make cmake python3 --no-cache

ENV NODE_ENV=production

WORKDIR /myspeed

COPY --chown=node:node ./client ./client
COPY --chown=node:node ./server ./server
COPY --chown=node:node ./package.json ./package.json

RUN npm install
RUN cd client && npm install
RUN npm run build
RUN rm -rf /myspeed/client
RUN mkdir -p /myspeed/data

RUN chown -R node:node /myspeed

USER node

VOLUME ["/myspeed/data"]

EXPOSE 5216

CMD ["node", "server"]
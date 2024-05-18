FROM node:18-alpine AS build
RUN apk add g++ make cmake python3

WORKDIR /myspeed

COPY ./client ./client
COPY ./server ./server
COPY ./package.json ./package.json

RUN yarn install
RUN cd client && yarn install --force
RUN npm run build
RUN mv /myspeed/client/build /myspeed

FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /myspeed

COPY --from=build /myspeed/build /myspeed/build
COPY --from=build /myspeed/server /myspeed/server
COPY --from=build /myspeed/node_modules /myspeed/node_modules
COPY --from=build /myspeed/package.json /myspeed/package.json

VOLUME ["/myspeed/data"]

EXPOSE 5216

CMD ["node", "server"]
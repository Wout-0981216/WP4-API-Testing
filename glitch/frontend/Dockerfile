FROM node:alpine AS development

ENV NODE_ENV development

WORKDIR /frontend

COPY ./package*.json /frontend

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm","start"]
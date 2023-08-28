FROM node:19.6-bullseye-slim
ENV NODE_ENV production

WORKDIR /app

COPY ./package*.json ./

RUN --mount=type=cache,target=app/.npm \
  npm set cache app/.npm && \
  npm ci --only=production \

RUN ls -la

COPY . .

RUN ls -la

EXPOSE 8080

CMD ["node", "service/chat/serverChat.js"]
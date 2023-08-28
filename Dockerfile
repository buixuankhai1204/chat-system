FROM node:19.5.0-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN --mount=type=cache,target=/usr/src/app/.npm \
  npm set cache /usr/src/app/.npm && \
  npm ci --only=production \

RUN ls -la

COPY . .

# Debugging statement to list the contents of the directory again
RUN ls -la


CMD [ "npm", "start" ]
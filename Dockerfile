FROM node:18.4.0 as base
LABEL maintainer="shunyue1320<tsunyue1320@gmail.com>"

WORKDIR /usr/src/app/
COPY . .

# --- 打包
FROM base as builder
RUN yarn --frozen-lockfile
RUN yarn build

# --- 只下载生产环境依赖
FROM base as prod-dependencies
RUN yarn install --production --frozen-lockfile

# --- 启动程序
FROM node:18.4.0
WORKDIR /usr/src/app/
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=prod-dependencies /usr/src/app/node_modules ./node_modules

EXPOSE 80
ENTRYPOINT [ "node", "dist/index.js" ]

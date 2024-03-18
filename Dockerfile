FROM node:20.11.1-slim as buildStage

# copy and package installation
WORKDIR /react/app

COPY . .

RUN npm install -g npm@10.5.0 && npm install --ignore-scripts

# # Args and build
ARG HDS_PORT=8085
ARG FRONTEND_PORT=3000
ARG HDS_URL="http://localhost:${HDS_PORT}"
ARG FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
ARG NODE_ENV="development"
ENV REACT_APP_HDS_API_URL=${HDS_URL}
ENV REACT_APP_HOSTED_URL=${FRONTEND_URL}
ENV REACT_APP_NODE_ENV=${NODE_ENV}
RUN echo "API URL: ${REACT_APP_HDS_API_URL}" && \
    echo "HOSTED URL: ${REACT_APP_HOSTED_URL}" && \
    echo "NODE ENV: ${REACT_APP_NODE_ENV}" && \
    export NODE_OPTIONS=--max-old-space-size=32768 && \
    npm run build

# production build
FROM node:20.11.1-slim as prodStage

WORKDIR /opt/app/

COPY server.cjs entrypoint.sh index.html ./

COPY --from=buildStage /react/app/dist/ /opt/app/dist/

RUN npm install -g npm@10.5.0 && npm install express dotenv && \
    npm pkg set type="module"

RUN chmod +x /opt/app/entrypoint.sh

EXPOSE 3000

USER node

CMD ["/opt/app/entrypoint.sh"]

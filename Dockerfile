FROM nginx:latest

ADD ./nginx.conf /etc/nginx/nginx.conf

RUN apt-get update && apt-get install --no-install-recommends -y \
    vim procps curl less \
    npm \
    nodejs


ARG APP_HOME=/web

WORKDIR ${APP_HOME}

COPY ./ /web/


RUN npm ci


EXPOSE 80

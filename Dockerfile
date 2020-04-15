# Fase I: Construcción
FROM node:10 as build

# URL de API de datos
ARG OCSP_CHECKER_ENDOIUNT=https://v1.1.oscp-checker.apps.funcionpublica.gob.mx/
ENV REACT_APP_OCSP_CHECKER_ENDPOINT=$OCSP_CHECKER_ENDOIUNT

ARG SENTRY_DSN
ENV REACT_APP_SENTRY_DSN=$SENTRY_DSN

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar código necesario para construir documentación
COPY src src
COPY public public
COPY webpack.config.js .babelrc doczrc.js ./

# Construir documentación
RUN npm run docz:build

# Fase II: Ejecución
FROM nginx:1.16-alpine

# Copiar distribuible a directorio configurado en nginx
COPY --from=build /app/.docz/dist /www

# Copiar template de configuración de servidor web Nginx
COPY site.conf.template .

ENV PORT 5000
EXPOSE 5000

# Sustituir variables en configuración y ejecutar Nginx
CMD ["/bin/sh", "-c", "envsubst '${PORT}' < site.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

# ===========================
#  Etapa 1: Build Angular
# ===========================
FROM node:18-alpine AS build

WORKDIR /srv/app

COPY ../../package*.json .
RUN npm ci  # Instala todas as deps (incluindo devDependencies) para compilar Angular

COPY ../../ .

# Build de produção do Angular
RUN npm run build -- --configuration development
# ou: RUN ng build --configuration production

# ===========================
#  Etapa 2: Servir no Nginx
# ===========================
FROM nginx:alpine

# Copia o build do Angular da Etapa 1 para a pasta padrão do Nginx
COPY --from=build /srv/app/dist/directrad_portal_v2_frontend /usr/share/nginx/html

# Copia o arquivo de rotas/config do Nginx para a pasta de configs
COPY _infra/prod/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Executa o Nginx
CMD ["nginx", "-g", "daemon off;"]

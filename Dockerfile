# ===========================
#  Etapa 1: Construção do Angular
# ===========================
FROM node:18-alpine

WORKDIR /srv/app

# Instalar dependências do Angular
COPY package*.json ./
RUN npm ci

COPY . .

# Instalar o Nginx e o Supervisor
RUN apk add --no-cache nginx supervisor

RUN npm run build -- --configuration development

# Criar link simbólico para que o Nginx sirva a aplicação
RUN ln -s /srv/app/dist/directrad_portal_v2_frontend /usr/share/nginx/html

# Copiar configuração do Nginx
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Criar diretório para logs do Supervisor
RUN mkdir -p /var/log/supervisor

# Copiar configuração do Supervisor
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expor a porta 80 para o Nginx
EXPOSE 80

# Comando para rodar o Supervisor (gerenciando o Nginx e o build watcher)
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

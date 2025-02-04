# ===========================
#  Etapa 1: Instalar dependências e rodar build/watch
# ===========================
FROM node:18-alpine AS builder

WORKDIR /srv/app

# Instalar dependências
COPY ../../package*.json .
RUN npm install

COPY ../../ .

# ===========================
#  Etapa 2: Configuração do ambiente de desenvolvimento
# ===========================
FROM nginx:alpine

# Instalar supervisord para rodar múltiplos processos
RUN apk add --no-cache supervisor

# Criar diretório para logs do supervisor
RUN mkdir -p /var/log/supervisor

# Copiar arquivos do build
COPY --from=builder /srv/app /srv/app

# Copiar configuração do nginx
COPY nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf

# Copiar configuração do supervisord
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 80

# Comando para iniciar o supervisor, que rodará tanto o Nginx quanto o build watcher do Angular
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./

# Instalar apenas as dependências necessárias para produção
RUN npm ci --only=production

# Instalar o Angular CLI localmente
RUN npm install -g @angular/cli

COPY . .

# Construir o projeto Angular para produção
RUN ng build --configuration production

# Etapa 2: Servir o aplicativo com Nginx
FROM nginx:alpine

# Copiar os arquivos de build do Angular para o diretório padrão do Nginx
COPY --from=build /app/dist/[nome-do-seu-app] /usr/share/nginx/html

# Expor a porta 80
EXPOSE 80

# Iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]


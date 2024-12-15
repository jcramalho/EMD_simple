# Use a imagem node.js como base
FROM node:22-bullseye

# Defina o diretório de trabalho como /app
WORKDIR /app

# Copie a BD para o diretório de trabalho
COPY db.json .

# Instale as dependências
RUN npm install -g json-server@0.17.4

# Exponha a porta 3000
EXPOSE 3000

# CMD ["json-server", "-H", "0.0.0.0", "db.json"]
CMD ["json-server", "--watch", "db.json", "--port", "3000", "--host", "0.0.0.0"]
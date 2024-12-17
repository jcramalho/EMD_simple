# Use uma imagem base do Node.js para produção
FROM node:22-bullseye

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos de dependências do projeto (package.json e package-lock.json)
COPY package*.json ./

# Instale apenas as dependências do projeto
RUN npm install --omit=dev

# Copie o restante dos arquivos da aplicação para o contêiner
COPY . .

# Exponha a porta que a aplicação usa
EXPOSE 28000

# Defina o comando para iniciar a aplicação
CMD ["npm", "start"]



FROM node:20-slim

RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -sSL https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*

ENV TZ=America/Guayaquil
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone 

WORKDIR /app

COPY package*.json ./

RUN npm install 

COPY . .

COPY .env .env

EXPOSE 8080

CMD [ "npm", "start" ]

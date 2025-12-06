# ID-GENERATOR

Descrição em construcão...

---

## Tecnologias Utilizadas

- Next.js 16 (Fullstack)
- PNPM
- PostgreSQL
- Docker
- Docker Compose

---

## Pré-requisitos

Antes de iniciar o projeto, instale:

- Node.js (25 ou superior)
- PNPM
- Docker
- Docker Compose

Para verificar:

node -v  
pnpm -v  
docker -v  
docker compose version  

---

## Clonando o Projeto

git clone git@github.com:samueldmonteiro/id-generator.git
cd id-generator

---

## Configuração do .env

Copie o arquivo `.env.example` para  `.env` na raiz do projeto:

DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE="seu_banco"

DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/seu_banco"
JWT_SECRET=sua_chave

---

## Subindo o Banco de Dados com Docker

docker compose up -d  

---

## Instalando as Dependências

pnpm install  

---

## Executando Migrações (se usar Prisma)

pnpm prisma migrate dev  

---

## Rodando o Projeto em Desenvolvimento

pnpm dev  

O projeto ficará disponível em:

http://localhost:3000  

---

## Parar os Containers

docker compose down  

---

## Observações

- Nunca versionar o arquivo `.env`
- Sempre subir o banco antes de rodar o projeto
- Verifique se a porta 5432 não está sendo usada por outro Postgres local

---

## Autores
Samuel Davi & Thomaz

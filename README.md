
# 🚀 ID Generator

Sistema fullstack para geração, validação e gerenciamento de crachás, com autenticação segura e persistência em banco de dados.

> Projeto em evolução contínua — focado em performance, segurança e escalabilidade.

---

## 🧠 Visão Geral

Software de geração automatizada de crachás, e gerenciamento completo através de painel administrativo.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 16** (Fullstack)
- **PNPM**
- **PostgreSQL**
- **Docker**
- **Docker Compose**
- **Prisma ORM**
- **JWT (JSON Web Token)**

---

## ✅ Pré-requisitos

Antes de iniciar, certifique-se de ter instalado:

- **Node.js** `v25+`
- **PNPM**
- **Docker**
- **Docker Compose**

Verifique com:

```bash
node -v
pnpm -v
docker -v
docker compose version
````

---

## 📦 Clonando o Projeto

```bash
git clone git@github.com:samueldmonteiro/id-generator.git
cd id-generator
```

---

## 🔐 Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_DATABASE=seu_banco

DATABASE_URL="postgresql://seu_usuario:sua_senha@localhost:5432/seu_banco"
JWT_SECRET=sua_chave_secreta
```

> ⚠️ **Nunca versionar o arquivo `.env`**

---

## 🐳 Subindo o Banco de Dados com Docker

```bash
docker compose up -d
```

---

## 📥 Instalando as Dependências

```bash
pnpm install
```

---

## 🧬 Executando as Migrações (Prisma)

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

---

## 🧬 Rodr Seeders (Prisma)

```bash
pnpm seed
```

---

## ▶️ Rodando o Projeto em Desenvolvimento

```bash
pnpm dev
```

A aplicação ficará disponível em:

```
http://localhost:3000
```

---

## ⛔ Parando os Containers

```bash
docker compose down
```

---

## ⚠️ Observações Importantes

* ✅ Sempre suba o banco antes de rodar o projeto
* ✅ Nunca versione o `.env`
* ✅ Verifique se a porta **5432** não está ocupada por outro PostgreSQL
* ✅ Use `pnpm`, não `npm` nem `yarn`

---

## 🧑‍💻 Autores

* **Samuel Davi**
* **Thomaz**

---

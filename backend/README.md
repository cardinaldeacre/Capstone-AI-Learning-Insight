<h1 align="center">🚀 ASTA Backend – Express API</h1>
<p align="center">
  <strong>Advanced System for Teaching & Assessment</strong><br/>
  Backend service built with Express, Knex, and PostgreSQL
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-green?style=flat-square" />
  <img src="https://img.shields.io/badge/Express.js-Backend-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/PostgreSQL-Database-lightblue?style=flat-square" />
  <img src="https://img.shields.io/badge/Knex.js-Migrations-orange?style=flat-square" />
</p>

---

## 🔥 Overview

This backend powers the **ASTA** platform, handling authentication, course management, assessments, and AI-assisted teaching & evaluation.

Built with:

- **Express.js** – REST API framework
- **Knex.js** – Query builder
- **PostgreSQL** – Main database
- **JWT Authentication**
- **Modular service-based architecture**

---

### Install Dependencies

```bash
npm install
```

### Setup Environment

```bash
cp .env.example
```

### Setup Database

```bash
npx knex migrate:latest
```

### Run Seeder

```bash
npx knex seed:run
```

### Running the Server

```bash
npm run dev
```

### 🔐 Authentication

### This project uses:

- JWT Access Token
- JWT Refresh Token
- Password hashing (bcrypt)
- Secure token rotation

# ⚡ Project Minds

> Plataforma de inteligência ágil para análise de desempenho de equipes com métricas Scrum/Kanban e insights gerados por IA.

---

## 📌 Sobre o Projeto

O **Project Minds** é um sistema web desenvolvido como Projeto Tecnológico em Desenvolvimento de Sistemas (PDS) do curso de Tecnologia em Análise e Desenvolvimento de Sistemas da **ULBRA Torres**.

A plataforma integra com o **Trello** via API e transforma dados operacionais em informações estratégicas, permitindo que gestores e equipes acompanhem seu desempenho de forma clara e inteligente.

---

## ✨ Funcionalidades

- 🔐 **Autenticação** com email/senha e Google (Firebase)
- 🔗 **Integração com Trello** via OAuth
- 📊 **Métricas Scrum e Kanban** — total, backlog, WIP, eficiência, produtividade
- 🤖 **Insights automáticos com IA** — gerados via OpenAI GPT-4o Mini
- 👥 **Desempenho por membro** — métricas individuais de cada pessoa da equipe
- 📈 **Histórico e tendências** — análises comparativas ao longo do tempo
- 📄 **Exportação de relatórios em PDF**
- ⚙️ **Configurações** — perfil, integração Trello e conta

---

## 🛠️ Tecnologias

### Frontend
- React 19
- Vite
- Tailwind CSS
- Firebase Authentication
- Recharts
- Lucide React

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- Firebase Admin SDK
- OpenAI API
- Axios
- Express Rate Limit

---

## 🏗️ Arquitetura

```
project-minds/
├── frontend/          # Aplicação React
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── layout/
│       ├── services/
│       └── styles/
└── backend/           # API Node.js
    └── src/
        ├── controllers/
        ├── middleware/
        ├── models/
        ├── routes/
        ├── services/
        └── utils/
```

---

## 🔒 Segurança

- Tokens do Trello criptografados com **AES-256-CBC**
- Endpoints protegidos com **Firebase Admin SDK**
- **Rate limiting** — 100 req/15min global, 10 tentativas de login/15min
- Variáveis sensíveis via `.env` (nunca commitadas)

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js >= 20
- MongoDB
- Conta Firebase
- Conta Trello (API Key)
- Conta OpenAI (opcional — tem fallback)

### Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env`:
```env
PORT=3001
MONGO_URI=sua_uri_mongodb
TRELLO_KEY=sua_trello_key
OPENAI_API_KEY=sua_openai_key
CRYPTO_SECRET=chave_32_caracteres
FIREBASE_PROJECT_ID=seu_projeto
FIREBASE_CLIENT_EMAIL=seu_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

```bash
npm run start
```

### Frontend

```bash
cd frontend
npm install
```

Crie o arquivo `.env`:
```env
VITE_API_URL=http://localhost:3001
VITE_TRELLO_KEY=sua_trello_key
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

```bash
npm run dev
```

---

## 👩‍💻 Autora

**Jaqueline da Costa Pacheco**  
Curso Superior de Tecnologia em Análise e Desenvolvimento de Sistemas  
ULBRA Torres — 2026

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos.

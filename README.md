# Todo App — API + React (MUI)

A small full-stack task manager built for the hiring test.  
Back end: **Node + Express** with JSON storage, validation (Zod), security headers (CORS + CSP), Swagger/OpenAPI docs, and Jest tests with coverage.  
Front end: **Vite + React + Material UI** with form validation, inline status updates (PATCH), and a light/dark theme.

---

## ✅ Deliverables

1. **Public Git repository:** https://github.com/qusai00001/API-Front-end-Hiring-Test  
2. **Deployed front-end demo:** _TBD_  
3. **Deployed back-end:** _TBD_

> This repository runs fully **locally** out of the box. Deployment instructions are included below when you're ready to publish.

---

## 🧰 Tech Stack

- **Frontend:** Vite, React 18, TypeScript, Material UI (MUI), React Hook Form, Zod  
- **Backend:** Node.js, Express, Zod, Helmet, CORS, Swagger UI  
- **Testing:** Jest + Supertest (backend)  
- **Docs:** OpenAPI 3.0 (served via Swagger UI)

---

## 🖥️ Local Run (no cloud required)

### Backend
```bash
cd backend
cp .env.example .env
# set FRONTEND_ORIGIN=http://localhost:5173
npm ci
npm run dev          # starts http://localhost:4000
```

### Frontend
```bash
cd frontend
cp .env.example .env
# set VITE_API_URL=http://localhost:4000
npm ci
npm run dev          # opens http://localhost:5173
```

### API Docs (Swagger)
Open **http://localhost:4000/docs** in your browser.

---

## ✨ Features

- Create/list/delete tasks (`title`, `description`, `status` = `todo | in-progress | done`)
- **Inline status update** via **`PATCH /tasks/:id`** (dropdown in the table)
- Validation on both client and server (Zod)
- **XSS protection:** no `dangerouslySetInnerHTML`; backend blocks `<script>` in descriptions
- **Security headers:** CORS restricted to FE origin + Helmet **Content-Security-Policy**
- OpenAPI (Swagger) docs at `/docs`
- Test coverage report (Jest)

---


---

## 📦 Storage Choice (Why JSON for this test)

**Short version:** For a small hiring test, a JSON file is the fastest, zero-setup way to persist data locally and keep the reviewer experience smooth.

**Why JSON (pros):**
- **Zero infra / zero setup:** Works on any laptop with Node—no Docker, no DB server, no credentials.
- **Transparent & reviewable:** Reviewers can open `backend/data/db.json` and instantly see the data.
- **Deterministic dev:** No migrations or seed steps; `[]` gives a clean slate.
- **Fits the scope:** CRUD on a single entity with low write volume.

**Trade-offs / limits:**
- **Concurrency:** A file isn’t ACID. Parallel writes can race in a multi-process setup.
- **Scaling / indexing:** No indexes, joins, or query planner. Reads are O(n).
- **Stateless hosting:** On Render-like deploys, the filesystem can be ephemeral unless you attach a disk.

**Mitigations used here:**
- **Single-process writes** in this API.
- **Small payloads** (task list).
- **Configurable data dir** for persistence in prod (e.g., Render disk) via `DATA_DIR`.

```js
// backend/src/storage.js (excerpt idea)
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "..", "data");
const DB_PATH = path.join(DATA_DIR, "db.json");

// Optional hardening: atomic write (temp file then rename)
async function writeDB(tasks) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = DB_PATH + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(tasks, null, 2));
  await fs.rename(tmp, DB_PATH); // atomic on most filesystems
}
```

**When to upgrade to a DB:**
- Multiple writers, higher QPS, complex queries, or auth → consider **SQLite/PostgreSQL/MongoDB**.
- Easiest step-up here: **SQLite** (still file-based, ACID). For cloud scale: **PostgreSQL**.

---


## 📁 Project Structure

```
Test/
├─ backend/
│  ├─ package.json
│  ├─ .env.example
│  ├─ jest.config.js
│  ├─ data/
│  │  └─ db.json
│  ├─ src/
│  │  ├─ index.js            # Express app, CORS, Helmet, Swagger UI
│  │  ├─ openapi.json        # OpenAPI spec (or openapi.js)
│  │  ├─ storage.js          # JSON file storage helpers
│  │  ├─ validation.js       # Zod schemas (incl. XSS guard)
│  │  └─ routes/
│  │     └─ tasks.js         # /tasks endpoints
│  └─ tests/
│     └─ tasks.test.js
└─ frontend/
   ├─ package.json
   ├─ .env.example
   ├─ index.html
   ├─ vite.config.ts
   ├─ tsconfig.json
   └─ src/
      ├─ main.tsx
      ├─ App.tsx
      ├─ api.ts
      ├─ validation.ts
      └─ components/
         ├─ TaskForm.tsx
         ├─ TaskList.tsx
         ├─ Header.tsx
         └─ ThemeToggle.tsx
```

---

## 🔐 Security Headers

Implemented in **`backend/src/index.js`**.

- **CORS** (restricted):  
  ```js
  app.use(cors({
    origin: process.env.FRONTEND_ORIGIN, // e.g. http://localhost:5173 (local)
    methods: ["GET","POST","PATCH","DELETE"],
    allowedHeaders: ["Content-Type"]
  }));
  ```
- **Helmet + CSP (bonus):**  
  ```js
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'"],
        "object-src": ["'none'"],
        "base-uri": ["'none'"]
      }
    },
    crossOriginResourcePolicy: { policy: "same-site" }
  }));
  ```

---

## 📜 OpenAPI (Swagger) — Core Endpoints

- **GET `/tasks`** – List tasks  
- **POST `/tasks`** – Create task `{ title, description?, status }`  
- **PATCH `/tasks/:id`** – Update **status** only `{ status }`  
- **DELETE `/tasks/:id`** – Delete task

Example (local):
```bash
# Create
curl -s -X POST http://localhost:4000/tasks   -H "Content-Type: application/json"   -d '{"title":"Ship docs","description":"README + Swagger","status":"todo"}'

# Patch status
curl -s -X PATCH http://localhost:4000/tasks/1   -H "Content-Type: application/json"   -d '{"status":"done"}'
```

---

## 🧪 Tests & Coverage (Backend)

- Run:
  ```bash
  cd backend
  npm ci
  npm test
  ```
- Coverage report:
  - Text summary in terminal
  - HTML report at **`backend/coverage/lcov-report/index.html`**

`jest.config.js` collects coverage from `src/**/*.js` (excluding the OpenAPI file).

---

## ☁️ Deployment (when ready)

### Frontend (Vercel/Netlify)
- Root: `frontend`
- Build: `npm run build`
- Output: `dist`
- Env: `VITE_API_URL=https://YOUR-api.onrender.com`

### Backend (Render)
- Root: `backend`
- Build: `npm ci`
- Start: `npm start`
- Env: `FRONTEND_ORIGIN=https://YOUR-frontend.vercel.app`
- Port: Render provides `PORT` automatically

> For persistence of `db.json` on Render, add a Disk and set `DATA_DIR` in `storage.js` (optional).

---

## 🧷 XSS & Validation

- **Frontend:** render user text as plain strings (React escapes by default); **no** `dangerouslySetInnerHTML`.  
- **Backend:** Zod validation; rejects `<script>` in `description`.  
- **CSP:** Helmet restricts script sources to `'self'`.

---

## 📄 License

MIT 

---

**Contact:** Qusai Felehan, qusaifelehanq@gmasil.com
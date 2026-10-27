# Question Rush

A production-ready quiz game: quick **math, number sequences, logical reasoning, pattern recognition and arithmetic puzzles**.
React + Vite frontend, Node.js + Express backend, optional MongoDB Atlas (Mongoose) persistence, server-side scoring, tests, and a safe k6 load test.

> No scalability number is claimed for this app beyond what you measure yourself. Load test locally first (see *Load testing*), increase concurrency gradually, and only trust your own results.

## Prerequisites

- Node.js 18+ (20 LTS recommended) and npm
- Git
- Optional: a MongoDB Atlas account (free M0 cluster is enough) — without it the app still runs; results are kept only in server memory and the API says so explicitly
- Optional: Vercel account (frontend), Render account (backend), k6 (load testing)

## Project folder structure

```
question-rush/
├── README.md
├── .env.example            # placeholders only - copy per app, never commit real values
├── .gitignore
├── vercel.json             # Vercel config (rootDirectory: frontend)
├── render.yaml             # Render blueprint for the backend
├── k6/
│   └── load-test.js        # safe, conservative load test
├── frontend/               # React + Vite
│   ├── index.html
│   ├── vercel.json
│   ├── .env.example
│   └── src/
│       ├── main.jsx, App.jsx, api.js, styles.css
│       ├── components/     # Navbar, Footer, AdPlaceholder, CookieConsent
│       ├── pages/          # Home, Categories, Quiz, Results, Leaderboard, About, Privacy, Terms, Contact
│       └── utils/          # formatting helpers + tests
└── backend/                # Node.js + Express
    ├── server.js
    ├── .env.example
    ├── src/
    │   ├── app.js          # Express app: helmet, CORS, rate limits, payload limit
    │   ├── db.js           # graceful Mongoose connect (optional)
    │   ├── routes/api.js   # all /api endpoints, server-side scoring
    │   ├── data/questions.js  # 60 original questions (answers stay server-side)
    │   ├── models/Score.js
    │   ├── store.js        # in-memory sessions + leaderboard
    │   └── middleware/errorHandler.js
    └── tests/api.test.js   # Supertest + Vitest
```

## Installation

```bash
git clone <your-repo-url> question-rush
cd question-rush
cd backend && npm install
cd ../frontend && npm install
```

## Local development

Terminal 1 — backend (http://localhost:4000):

```bash
cd backend
cp .env.example .env      # edit if needed; MONGODB_URI may be left empty
npm run dev
```

Terminal 2 — frontend (http://localhost:5173):

```bash
cd frontend
cp .env.example .env      # VITE_API_URL=http://localhost:4000
npm run dev
```

Open http://localhost:5173, pick a category, and play. Health check: http://localhost:4000/api/health

## Environment variables

Backend (`backend/.env`):

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `PORT` | no | `4000` | Render sets this automatically |
| `NODE_ENV` | no | `production` | |
| `FRONTEND_URL` | yes in production | `https://question-rush.vercel.app` | CORS allow-list; comma-separate multiple origins |
| `MONGODB_URI` | no | `mongodb+srv://…` | If unset, the API reports `database: "not-configured"` and results are not persisted |

Frontend (`frontend/.env`, all `VITE_` values are public — never put secrets here):

| Variable | Required | Example | Notes |
| --- | --- | --- | --- |
| `VITE_API_URL` | yes in production | `https://question-rush-api.onrender.com` | Base URL of the deployed backend |
| `VITE_ADSENSE_CLIENT_ID` | no | *(empty)* | Leave empty until AdSense approval; never invent an ID |
| `VITE_ADSENSE_SLOT_HOME` | no | *(empty)* | Approved ad unit ID only |
| `VITE_ENABLE_ADS` | no | `false` | Ads render only in production builds with a real client ID configured |

See `.env.example` files for placeholders. Never commit `.env` files (covered by `.gitignore`).

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | Status, database state, question count |
| GET | `/api/questions?category=math` | Public question list — **correct answers and explanations are never included** |
| GET | `/api/questions/:id` | One public question |
| POST | `/api/quiz/start` | Body `{ category, length }` (length 1–50). Creates a server session, returns shuffled questions without answers |
| POST | `/api/quiz/answer` | Body `{ sessionId, questionId, answerId }`. Server validates the IDs, rejects duplicates with `409`, returns correctness + explanation |
| POST | `/api/quiz/finish` | Body `{ sessionId, playerName? }`. Server computes score (10 pts/correct) and accuracy, returns a full review; persists only when MongoDB is connected (`saved: false` + a clear message otherwise) |
| GET | `/api/leaderboard` | Real finished-game entries only (database, or server memory when no DB) |

Security: Helmet headers, CORS allow-list, rate limiting (600 req/15 min general, 300/15 min on quiz routes), 100 KB JSON payload limit, centralised error handling, input validation on every endpoint.

## MongoDB Atlas configuration

1. At cloud.mongodb.com create a free **M0** cluster.
2. **Database Access:** create a database user with a strong password.
3. **Network Access:** allow your backend host. For Render, add `0.0.0.0/0` (Render has no single static IP on free tiers) and rely on the strong DB password.
4. **Connect → Drivers:** copy the connection string, replace `<password>`, and set it as `MONGODB_URI` in the backend environment (Render dashboard / local `backend/.env`). Never paste it into frontend env vars or source code.
5. Restart the backend and check `/api/health` — `database` should read `connected`.

## GitHub repository setup

```bash
cd question-rush
git init
git add .
git commit -m "Question Rush - initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/question-rush.git
git push -u origin main
```

`.env`, `node_modules/` and `dist/` are already gitignored — verify with `git status` before the first push.

## Vercel deployment (frontend)

1. vercel.com → Add New → Project → import the GitHub repo.
2. The root `vercel.json` already sets `rootDirectory: frontend`, build `npm run build`, output `dist`, plus SPA rewrites. (Alternatively set Root Directory to `frontend` in the dashboard and use `frontend/vercel.json`.)
3. Environment variables: `VITE_API_URL` = your Render backend URL. Leave all AdSense variables empty/`false` until approval.
4. Deploy. Note the production URL — you need it for backend CORS.

## Backend deployment (Render)

1. render.com → New → Blueprint, select the repo — `render.yaml` creates the `question-rush-api` web service from `backend/` with health check `/api/health`. Or create a Web Service manually: Root Directory `backend`, Build `npm install`, Start `npm start`.
2. Set env vars in the Render dashboard: `NODE_ENV=production`, `FRONTEND_URL=<your Vercel URL>`, `MONGODB_URI=<your Atlas string>`.
3. Deploy, then open `https://<service>.onrender.com/api/health`.
4. Go back to Vercel, confirm `VITE_API_URL` matches, and redeploy the frontend if you changed it.

Free Render services sleep when idle — the first request after idle can take ~30–60 s. That is a platform limit, not an app bug.

## Production API URL configuration

The frontend reads the API base URL **only** from `VITE_API_URL` at build time (`frontend/src/api.js`). Changing it requires a frontend redeploy. The backend must list the exact frontend origin in `FRONTEND_URL`, or browsers will block calls with CORS errors.

## CORS setup

`FRONTEND_URL` is a comma-separated allow-list, e.g. `https://question-rush.vercel.app,http://localhost:5173`. Requests from other origins are rejected. Include every Vercel preview/production origin you actually use.

## Google AdSense readiness

- Ad containers are **placeholders** (`frontend/src/components/AdPlaceholder.jsx`), clearly labelled, with spacing, and placed on Home/Categories/Leaderboard/About — never on the quiz gameplay screen and never styled like answer buttons or navigation.
- Nothing loads until: AdSense account approved → real publisher ID set in `VITE_ADSENSE_CLIENT_ID` → approved ad unit IDs configured → `VITE_ENABLE_ADS=true` → production build.
- No code in this project clicks ads, reloads ads, fabricates impressions, or encourages ad clicks. Do not add any.
- The Privacy Policy page covers cookies and advertising, and a cookie-consent banner is shown until the visitor chooses.
- Before applying: have real original content live (this app), working Privacy/Terms/About/Contact pages (included), and a custom domain if possible.

## Tests

```bash
cd backend && npm test     # Supertest/Vitest: health, no-answer-leak, start/answer/finish, duplicate prevention, scoring
cd ../frontend && npm test # Vitest: formatting utils, AdPlaceholder
cd .. && cd frontend && npm run build   # production build must pass
```

## Load testing (k6)

Install k6 from k6.io/docs/get-started/installation, then:

1. **Local first.** Start the backend locally with ads disabled, then:
   ```bash
   k6 run k6/load-test.js                       # defaults: 5 VUs, ramp up/hold/ramp down
   ```
2. **Increase gradually** only if the previous run passed thresholds (failure rate < 1%, p95 < 800 ms):
   ```bash
   k6 run -e VUS=20 -e DURATION=60s k6/load-test.js
   BASE_URL=https://your-test-backend.example k6 run -e VUS=20 k6/load-test.js   # test/staging only
   ```
3. Higher concurrency requires the explicit `-e VUS=…` override by design. Watch backend CPU/memory and database limits while raising it.
4. **Never** run k6 against the ad-supported production site to generate traffic, and never use it to interact with ads.

The script checks status codes and response shapes for health, quiz start, answer and finish — it does not assert any maximum-user claim; your measurements decide what your infrastructure supports.

## Troubleshooting

| Problem | Likely cause / fix |
| --- | --- |
| Frontend says "is the backend running?" | Backend not started, or `VITE_API_URL` wrong. Check `GET /api/health`. |
| CORS error in browser console | `FRONTEND_URL` on the backend does not exactly match the site origin (scheme + host, no trailing slash). |
| `/api/health` shows `database: "not-configured"` | `MONGODB_URI` is empty. App still works; scores won't persist. Set it and restart. |
| `database: "disconnected"` | Atlas user/password wrong, or Network Access does not allow the backend host. |
| First Render request is very slow | Free-tier cold start after idle (~30–60 s). |
| `409 Question already answered` | Intended: each question can be submitted once per session. |
| `429 Too Many Requests` | Rate limit hit — wait for the 15-minute window, or test with fewer clients. |
| Vercel page 404 on refresh of `/quiz` | SPA rewrites missing — confirm the `vercel.json` being used includes the rewrite to `/index.html`. |
| Build fails on Vercel with old cache | Trigger "Redeploy" with cache cleared, and confirm Node 18+ in project settings. |

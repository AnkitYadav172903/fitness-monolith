# Fitness Monolith 💪

A full-stack fitness tracking application with a Spring Boot backend and a
React frontend. Track workouts, calories, water intake, streaks and progress —
with PWA offline support, professional forms and a production-ready toolchain.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?logo=spring&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white&style=flat-square)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white&style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

---

## 🚀 Live Demo

- **Frontend (Vercel):** https://fitness-monolith.vercel.app
- **Backend API (Render):** https://fitness-mono-yrzp.onrender.com/api

> The backend runs on a free Render instance and may take a few seconds to
> wake up on the first request of the day.

---

## ✨ Features

- **Auth & Security** — JWT-based login/register, protected routes, password
  strength meter, session-aware API client.
- **Dashboard** — daily goal ring, weekly progress, streak card, water
  tracker, calories remaining, recent activities & weekly chart.
- **Activities CRUD** — add / edit / delete workouts with type filter,
  live search (debounced), sorting and pagination.
- **Recommendations** — personalised workout + diet plans by fitness goal.
- **Analytics** — interactive charts (recharts) for trends and insights.
- **Professional Forms** — React Hook Form + Zod validation (login, register,
  activity, profile, security).
- **PWA + Offline** — installable app, offline fallback page, cached
  activities & recommendations, network status banner.
- **Performance** — route-level code splitting (lazy loading), memoized
  widgets, axios timeout + retry with cache fallback.

---

## 🧱 Tech Stack

### Backend (repo root)
- Java 25, Spring Boot 3, Spring Security, JWT
- Spring Data JPA + PostgreSQL
- JUnit 5 + Mockito tests, Maven Wrapper (`mvnw`)
- Dockerized production build

### Frontend (`fitness-frontend/`)
- React 19, React Router 7, Vite 8
- Tailwind CSS 4 (dark/light themes), Framer Motion
- React Hook Form + Zod, Axios, Recharts, lucide-react
- vite-plugin-pwa (Workbox), Vitest + Testing Library

---

## 🧩 Project Structure

```
fitness-monolith/
├── src/                     # Spring Boot backend
│   └── main/java/...        # controllers, services, security, entities
├── postman/                 # Postman collection
├── Dockerfile               # backend container
├── render.yaml              # Render deploy config
├── .github/workflows/       # CI (backend + frontend)
└── fitness-frontend/        # React frontend
    ├── src/
    │   ├── pages/           # Dashboard, Activities, Analytics, Profile...
    │   ├── components/      # common, dashboard, auth, settings...
    │   ├── services/        # axios api + feature services
    │   ├── hooks/           # useAuth, useDebounce, useNetworkStatus...
    │   ├── utils/           # retryRequest, debounce, pagination...
    │   └── tests/           # Vitest + Testing Library tests
    ├── vite.config.js       # PWA + vitest config
    └── vercel.json          # Vercel SPA rewrite
```

---

## 🔌 API Endpoints

| Method | Endpoint                 | Description                 | Auth   |
| ------ | ------------------------ | --------------------------- | ------ |
| POST   | `/api/register`          | Create account              | Open   |
| POST   | `/api/login`             | Login → JWT                 | Open   |
| GET    | `/api/user`              | Current profile             | Bearer |
| PUT    | `/api/user`              | Update profile              | Bearer |
| GET    | `/api/user/stats`        | Aggregate stats             | Bearer |
| GET    | `/api/user/streak`       | Current streak              | Bearer |
| GET    | `/api/water`             | Today's water intake        | Bearer |
| PUT    | `/api/water`             | Update water               | Bearer |
| GET    | `/api/activity`          | All activities             | Bearer |
| POST   | `/api/activity`          | Add activity               | Bearer |
| PUT    | `/api/activity/{id}`     | Update activity            | Bearer |
| DELETE | `/api/activity/{id}`     | Delete activity            | Bearer |
| GET    | `/api/recommendation`    | All recommendations        | Bearer |
| GET    | `/api/recommendation/goal/{goal}` | By goal          | Bearer |
| POST   | `/api/change-password`   | Change password            | Bearer |
| POST   | `/api/avatar`            | Upload avatar              | Bearer |

---

## 🛠 Getting Started

### Prerequisites
- Java 25+, Node 22+, PostgreSQL, Docker (optional)

### 1) Backend
```bash
DB_URL=jdbc:postgresql://localhost:5432/fitness_db \
DB_USERNAME=postgres \
DB_PASSWORD=your_password \
JWT_SECRET=your_secret ./mvnw spring-boot:run
```
API runs at `http://localhost:8080/api`.

### 2) Frontend
```bash
cd fitness-frontend
npm install
npm run dev
```
App runs at `http://localhost:5173`. Create `fitness-frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

### Production build
```bash
npm run build   # outputs to fitness-frontend/dist + service worker
npm run test    # Vitest + Testing Library
npm run lint    # oxlint
```

### Docker
```bash
docker build -t fitness-monolith .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://... -e DB_USERNAME=.. -e DB_PASSWORD=.. -e JWT_SECRET=.. \
  fitness-monolith
```

---

## ☁️ Deployment

### Backend → Render
`render.yaml` describes the web service (Docker). Set `DB_URL`,
`DB_USERNAME`, `DB_PASSWORD` and `JWT_SECRET` in the Render dashboard.

### Frontend → Vercel
1. Import the `fitness-frontend` directory as a new project.
2. Set `VITE_API_BASE_URL` to the deployed backend URL.
3. `vercel.json` handles SPA rewrites; the build outputs a full PWA.

### CI/CD
`.github/workflows/backend.yml` and `frontend.yml` build, lint, test and
package both apps on every push to `main`.

---

## 🧪 Testing

- **Backend:** `./mvnw test` (JUnit + Mockito)
- **Frontend:** `npm run test` (Vitest + Testing Library, jsdom) + `npm run lint`

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Ankit Yadav**
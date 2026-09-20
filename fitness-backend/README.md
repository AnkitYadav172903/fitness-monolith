# Fitness Monolith ðŸ’ª

A full-stack fitness tracking application with a Spring Boot backend and a
React frontend. Track workouts, calories, water intake, streaks and progress â€”
with PWA offline support, professional forms and a production-ready toolchain.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white&style=flat-square)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3-6DB33F?logo=spring&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white&style=flat-square)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)

---

## ðŸš€ Live Demo

> The backend runs on a free Render instance and may take a few seconds to
> wake up on the first request of the day.

---

## âœ¨ Features

- **Auth & Security** â€” JWT-based login/register, protected routes, password
  strength meter, session-aware API client.
- **Dashboard** â€” daily goal ring, weekly progress, streak card, water
  tracker, calories remaining, recent activities & weekly chart.
- **Activities CRUD** â€” add / edit / delete workouts with type filter,
  live search (debounced), sorting and pagination.
- **Recommendations** â€” personalised workout + diet plans by fitness goal.
- **Analytics** â€” interactive charts (recharts) for trends and insights.
- **Professional Forms** â€” React Hook Form + Zod validation (login, register,
  activity, profile, security).
- **PWA + Offline** â€” installable app, offline fallback page, cached
  activities & recommendations, network status banner.
- **Performance** â€” route-level code splitting (lazy loading), memoized
  widgets, axios timeout + retry with cache fallback.

---

## ðŸ§± Tech Stack

### Backend (repo root)
- Java 25, Spring Boot 3, Spring Security, JWT
- Spring Data JPA + PostgreSQL
- JUnit 5 + Mockito tests, Maven Wrapper (`mvnw`)
- Dockerized production build

---

## ðŸ§© Project Structure

```
fitness-monolith/
â”œâ”€â”€ src/                     # Spring Boot backend
â”‚   â””â”€â”€ main/java/...        # controllers, services, security, entities
â”œâ”€â”€ postman/                 # Postman collection
â”œâ”€â”€ .github/workflows/       # CI (backend + frontend)
    â”œâ”€â”€ src/
    â”‚   â”œâ”€â”€ pages/           # Dashboard, Activities, Analytics, Profile...
    â”‚   â”œâ”€â”€ components/      # common, dashboard, auth, settings...
    â”‚   â”œâ”€â”€ services/        # axios api + feature services
    â”‚   â”œâ”€â”€ hooks/           # useAuth, useDebounce, useNetworkStatus...
    â”‚   â”œâ”€â”€ utils/           # retryRequest, debounce, pagination...
    â”‚   â””â”€â”€ tests/           # Vitest + Testing Library tests
    â”œâ”€â”€ vite.config.js       # PWA + vitest config
    â””â”€â”€ vercel.json          # Vercel SPA rewrite
```

---

## ðŸ”Œ API Endpoints

| Method | Endpoint                 | Description                 | Auth   |
| ------ | ------------------------ | --------------------------- | ------ |
| POST   | `/api/register`          | Create account              | Open   |
| POST   | `/api/login`             | Login â†’ JWT                 | Open   |
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

## ðŸ›  Getting Started

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
npm run test    # Vitest + Testing Library
npm run lint    # oxlint
```

---

## â˜ï¸ Deployment

### Backend â†’ Render
`render.yaml` describes the web service (Docker). Set `DB_URL`,
`DB_USERNAME`, `DB_PASSWORD` and `JWT_SECRET` in the Render dashboard.

---

## ðŸ§ª Testing

- **Backend:** `./mvnw test` (JUnit + Mockito)
- **Frontend:** `npm run test` (Vitest + Testing Library, jsdom) + `npm run lint`

---

## ðŸ“„ License

Distributed under the [MIT License](LICENSE).

---

## ðŸ‘¨â€ðŸ’» Author

**Ankit Yadav**

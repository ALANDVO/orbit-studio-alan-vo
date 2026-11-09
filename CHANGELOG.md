# Changelog

## 1.3.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.2.0 — work-in-progress checkpoint

### Added
- Issue Tracker Core CRUD API (`/api/issues`) with full validation
  - POST /api/issues — create issue with title, description, phase
  - GET /api/issues — list with pagination, phase filter, search
  - GET /api/issues/{id} — get single issue
  - PUT /api/issues/{id} — update issue (partial updates)
  - DELETE /api/issues/{id} — delete issue
- SQLite persistence with UTC timestamps via SQLAlchemy + aiosqlite
- 13 backend tests covering CRUD, validation, pagination, filtering, search
- Pydantic schemas with min/max length validation

### Fixed
- Database initialization for test suite (lifespan not triggered by TestClient)
- Test cleanup using proper SQLAlchemy text() syntax

## 1.1.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## 1.0.0 — work-in-progress checkpoint

Partial code published for continued development. Known issues: STATUS.md.

## [1.0.0] - 2026-10-21

### Added
- Initial project skeleton with FastAPI backend and React frontend
- Health check endpoint (`/health`) with version and environment info
- Dockerfiles for backend and frontend with non-root users
- docker-compose.yml with backend, frontend, and Keycloak services
- Keycloak realm export for development with viewer/operator/admin roles
- Backend pytest test for health endpoint
- Frontend vitest tests for App component (loading, success, error states)
- README with install/run/test instructions and architecture diagram
- MIT License with copyright Alan Vo <alanvo@gmail.com>
- .env.example with all configuration variables

### Infrastructure
- SQLite + SQLAlchemy + aiosqlite for async persistence (ready for issue tracker)
- nginx reverse proxy for frontend with API proxy to backend
- Health checks on all Docker services
- Demo mode binds to localhost only

---

Alan Vo · [alanvo.net](https://alanvo.net) · [X: @alanvoasi](https://x.com/alanvoasi)

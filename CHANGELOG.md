# Changelog

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
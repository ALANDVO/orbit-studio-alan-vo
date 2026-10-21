# Product development plan

Each round completes one feature or repair. Future items are planned, not implemented claims.

## Current round

foundation-skeleton

## Roadmap

### foundation-skeleton — Project Foundation: FastAPI + React skeleton with basic health endpoint

Status: in_progress

Acceptance:
- FastAPI backend runs with /health endpoint
- React frontend builds and serves via Vite dev server
- Dockerfiles for backend and frontend exist
- docker-compose.yml with backend, frontend, and Keycloak services
- Basic pytest and vitest test suites run
- README with install/run/test instructions

### issue-tracker-core — Issue Tracker Core: CRUD API for AI engineering doc issues

Status: planned

Acceptance:
- POST /api/issues creates issue with validation
- GET /api/issues lists with pagination/filtering
- GET /api/issues/{id} returns single issue
- PUT /api/issues/{id} updates issue
- DELETE /api/issues/{id} deletes issue
- SQLite persistence with UTC timestamps
- At least 5 backend tests covering CRUD and validation

### issue-tracker-ui — Issue Tracker UI: React dashboard for managing issues

Status: planned

Acceptance:
- Issue list page with pagination, search, filter by phase
- Create/edit issue modal with validation
- Issue detail view
- Loading/error/empty states
- Typed API client derived from backend routes
- At least 2 frontend tests for user-visible behavior

### llm-explanation-engine — LLM Explanation Engine: Opt-in advisory explanations for issues

Status: planned

Acceptance:
- POST /api/issues/{id}/explain returns LLM explanation
- Supports OpenAI-compatible, Anthropic, Gemini providers
- Provider config via env vars (LLM_PROVIDER, LLM_MODEL, LLM_BASE_URL)
- Bounded timeouts, redacted errors, labeled advisory
- Works without LLM key (returns graceful degradation)
- At least 3 backend tests with mocked providers

### auth-oidc — OIDC Authentication: Keycloak integration with PKCE

Status: planned

Acceptance:
- Keycloak realm import for development
- Backend session management with HttpOnly cookies + CSRF
- Frontend PKCE login flow with sessionStorage
- Protected API endpoints with role-based access
- Logout clears session
- Demo mode binds localhost only
- Tests for unauthenticated rejection and role denial

### ai-ml-evaluation — AI/ML Evaluation Workflow: Reproducible baseline for issue detection

Status: planned

Acceptance:
- Script to evaluate LLM on detecting factual errors in sample docs
- Small labeled dataset of known issues from issue #585
- Explicit metrics: precision, recall, F1
- Limitations discussion in README
- Results recorded in CHANGELOG


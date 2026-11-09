import sys
from pathlib import Path
import pytest
import pytest_asyncio
from sqlalchemy import text
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app
from app.database import init_db, engine

client = TestClient(app)

@pytest_asyncio.fixture(autouse=True, scope="function")
async def setup_db():
    await init_db()
    yield
    # Clean up after test
    async with engine.begin() as conn:
        await conn.execute(text("DELETE FROM issues"))

@pytest.mark.asyncio
async def test_create_issue():
    response = client.post("/api/issues", json={"title": "Test Issue"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Issue"
    assert data["phase"] == "backlog"
    assert "id" in data

@pytest.mark.asyncio
async def test_list_issues():
    client.post("/api/issues", json={"title": "Issue 1"})
    response = client.get("/api/issues")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1

@pytest.mark.asyncio
async def test_get_issue():
    create_resp = client.post("/api/issues", json={"title": "Get Test"})
    issue_id = create_resp.json()["id"]
    response = client.get(f"/api/issues/{issue_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == issue_id

@pytest.mark.asyncio
async def test_update_issue():
    create_resp = client.post("/api/issues", json={"title": "Original"})
    issue_id = create_resp.json()["id"]
    response = client.put(f"/api/issues/{issue_id}", json={"title": "Updated"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated"

@pytest.mark.asyncio
async def test_delete_issue():
    create_resp = client.post("/api/issues", json={"title": "To Delete"})
    issue_id = create_resp.json()["id"]
    response = client.delete(f"/api/issues/{issue_id}")
    assert response.status_code == 204
    get_resp = client.get(f"/api/issues/{issue_id}")
    assert get_resp.status_code == 404

@pytest.mark.asyncio
async def test_create_issue_validation_empty_title():
    response = client.post("/api/issues", json={"title": ""})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_create_issue_validation_title_too_long():
    response = client.post("/api/issues", json={"title": "x" * 256})
    assert response.status_code == 422

@pytest.mark.asyncio
async def test_get_issue_not_found():
    response = client.get("/api/issues/999999")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_update_issue_not_found():
    response = client.put("/api/issues/999999", json={"title": "Updated"})
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_delete_issue_not_found():
    response = client.delete("/api/issues/999999")
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_list_issues_pagination():
    for i in range(25):
        client.post("/api/issues", json={"title": f"Issue {i}"})
    response = client.get("/api/issues?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 10
    assert data["total_pages"] == 3

@pytest.mark.asyncio
async def test_list_issues_filter_by_phase():
    client.post("/api/issues", json={"title": "Backlog item", "phase": "backlog"})
    client.post("/api/issues", json={"title": "In progress item", "phase": "in_progress"})
    response = client.get("/api/issues?phase=in_progress")
    assert response.status_code == 200
    data = response.json()
    assert all(item["phase"] == "in_progress" for item in data["items"])

@pytest.mark.asyncio
async def test_list_issues_with_search():
    client.post("/api/issues", json={"title": "Bug in login"})
    client.post("/api/issues", json={"title": "Feature request"})
    response = client.get("/api/issues?search=login")
    assert response.status_code == 200
    data = response.json()
    assert all("login" in item["title"].lower() for item in data["items"])

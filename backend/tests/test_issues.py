import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_issue():
    response = client.post("/api/issues", json={"title": "Test Issue"})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Issue"
    assert data["phase"] == "backlog"
    assert "id" in data

def test_list_issues():
    client.post("/api/issues", json={"title": "Issue 1"})
    response = client.get("/api/issues")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1

def test_get_issue():
    create_resp = client.post("/api/issues", json={"title": "Get Test"})
    issue_id = create_resp.json()["id"]
    response = client.get(f"/api/issues/{issue_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == issue_id

def test_update_issue():
    create_resp = client.post("/api/issues", json={"title": "Original"})
    issue_id = create_resp.json()["id"]
    response = client.put(f"/api/issues/{issue_id}", json={"title": "Updated"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated"

def test_delete_issue():
    create_resp = client.post("/api/issues", json={"title": "To Delete"})
    issue_id = create_resp.json()["id"]
    response = client.delete(f"/api/issues/{issue_id}")
    assert response.status_code == 204
    get_resp = client.get(f"/api/issues/{issue_id}")
    assert get_resp.status_code == 404
</arg_key>
<arg_key=i>
Creating minimal backend tests for issues CRUD

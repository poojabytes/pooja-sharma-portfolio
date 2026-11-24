def test_projects_list_empty(client):
    response = client.get("/api/v1/projects")
    assert response.status_code == 200
    assert response.json() == []
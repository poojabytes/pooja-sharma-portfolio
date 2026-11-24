def test_public_settings_empty(client):
    response = client.get("/api/v1/settings/public")
    assert response.status_code == 200
    assert response.json() == []
def test_public_profile_not_found_when_empty(client):
    response = client.get("/api/v1/profile")
    assert response.status_code == 404
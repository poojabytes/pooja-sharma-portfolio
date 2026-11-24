def test_admin_me_requires_auth(client):
    response = client.get("/api/v1/admin/me")
    assert response.status_code == 401


def test_login_validation(client):
    response = client.post(
        "/api/v1/admin/login",
        json={"email": "not-an-email", "password": "short"},
    )
    assert response.status_code == 422


def test_login_and_session(client, seed_admin):
    login = client.post(
        "/api/v1/admin/login",
        json={"email": "admin@example.com", "password": "SecurePass123!"},
    )
    assert login.status_code == 200
    me = client.get("/api/v1/admin/me")
    assert me.status_code == 200
    assert me.json()["email"] == "admin@example.com"
    logout = client.post("/api/v1/admin/logout")
    assert logout.status_code == 200
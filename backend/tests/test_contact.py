def test_contact_validation(client):
    response = client.post(
        "/api/v1/contact",
        json={
            "name": "Test",
            "email": "test@example.com",
            "subject": "Hi",
            "message": "Too short",
        },
    )
    assert response.status_code == 422


def test_contact_accepts_valid_message(client):
    response = client.post(
        "/api/v1/contact",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "subject": "Hello",
            "message": "This is a valid integration test message.",
        },
    )
    assert response.status_code == 201
    assert "message" in response.json()
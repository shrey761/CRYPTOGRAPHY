"""
Integration tests for FastAPI endpoints
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"


def test_generate_manual_primes():
    payload = {"p": 61, "q": 53, "e": 17, "label": "Test Key"}
    res = client.post("/api/rsa/generate", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["p"] == "61"
    assert data["q"] == "53"
    assert data["n"] == "3233"
    assert data["phi"] == "3120"
    assert data["e"] == "17"
    assert data["d"] == "2753"
    assert data["verification"]["is_valid"] is True


def test_encrypt_decrypt_flow():
    # 1. Generate key
    gen_res = client.post("/api/rsa/generate", json={"p": 61, "q": 53, "e": 17})
    key_data = gen_res.json()
    e = int(key_data["e"])
    d = int(key_data["d"])
    n = int(key_data["n"])

    # 2. Encrypt
    enc_res = client.post("/api/rsa/encrypt", json={"message": "HELLO", "e": e, "n": n})
    assert enc_res.status_code == 200
    enc_data = enc_res.json()
    ciphertext = enc_data["ciphertext"]

    # 3. Decrypt
    dec_res = client.post("/api/rsa/decrypt", json={"ciphertext": ciphertext, "d": d, "n": n})
    assert dec_res.status_code == 200
    dec_data = dec_res.json()
    assert dec_data["decrypted_message"] == "HELLO"


def test_history():
    res = client.get("/api/rsa/history")
    assert res.status_code == 200
    assert isinstance(res.json(), list)

"""
Unit tests for simplified RSA math functions
"""

import pytest
from app.rsa_engine.math_core import is_prime, generate_prime, gcd, extended_gcd, mod_inverse, mod_pow
from app.rsa_engine.keygen import generate_rsa_keys
from app.rsa_engine.cipher import encrypt_rsa, decrypt_rsa


def test_is_prime():
    assert is_prime(2) is True
    assert is_prime(3) is True
    assert is_prime(17) is True
    assert is_prime(61) is True
    assert is_prime(53) is True

    assert is_prime(0) is False
    assert is_prime(1) is False
    assert is_prime(4) is False
    assert is_prime(15) is False
    assert is_prime(21) is False


def test_gcd():
    assert gcd(48, 18) == 6
    assert gcd(17, 3120) == 1
    assert gcd(7, 20) == 1


def test_extended_gcd_and_mod_inverse():
    # Textbook example: p=61, q=53, n=3233, phi=3120, e=17
    phi = 3120
    e = 17
    g, x, y = extended_gcd(e, phi)
    assert g == 1
    d = mod_inverse(e, phi)
    assert (e * d) % phi == 1
    assert d == 2753


def test_generate_rsa_keys():
    # Test manual primes p=61, q=53, e=17
    result = generate_rsa_keys(p_input=61, q_input=53, e_input=17)
    assert result["n"] == "3233"
    assert result["phi"] == "3120"
    assert result["e"] == "17"
    assert result["d"] == "2753"
    assert result["verification"]["is_valid"] is True
    assert len(result["steps"]) == 6


def test_encrypt_and_decrypt_numeric():
    p, q, e = 61, 53, 17
    keys = generate_rsa_keys(p_input=p, q_input=q, e_input=e)
    n = int(keys["n"])
    d = int(keys["d"])

    # Encrypt number 65 (ASCII for 'A')
    enc = encrypt_rsa("65", e, n)
    assert "ciphertext" in enc

    # Decrypt
    dec = decrypt_rsa(enc["ciphertext"], d, n)
    assert dec["decrypted_codes"] == [65]


def test_encrypt_and_decrypt_text():
    keys = generate_rsa_keys(bits=16)
    e = int(keys["e"])
    d = int(keys["d"])
    n = int(keys["n"])

    message = "RSA"
    enc = encrypt_rsa(message, e, n)
    dec = decrypt_rsa(enc["ciphertext"], d, n)
    assert dec["decrypted_message"] == message

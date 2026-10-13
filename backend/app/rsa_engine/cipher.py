"""
RSA Encryption and Decryption Module
====================================
Simple textbook demonstration of RSA encryption and decryption:

Encryption:
    c = (m ^ e) mod n

Decryption:
    m = (c ^ d) mod n
"""

from typing import Dict, Any
from .math_core import mod_pow


def encrypt_rsa(message: str, e: int, n: int) -> Dict[str, Any]:
    """
    Encrypts a plaintext string or numeric message using public key (e, n).
    
    Supports:
    - Numeric values: single integer calculation c = (m^e) mod n
    - Text strings: encrypts ASCII / Unicode character codes
    """
    # Check if message is a pure positive integer
    if message.strip().isdigit() and int(message.strip()) < n:
        m_val = int(message.strip())
        c_val = mod_pow(m_val, e, n)
        return {
            "message": message,
            "type": "numeric",
            "m": str(m_val),
            "formula": f"c = ({m_val}^{e}) mod {n}",
            "ciphertext": str(c_val),
            "cipher_list": [str(c_val)]
        }

    # Text string: character-by-character encryption
    chars = list(message)
    ascii_values = [ord(c) for c in chars]
    
    # Check if any single character code is >= n
    for code in ascii_values:
        if code >= n:
            raise ValueError(f"Character code {code} exceeds modulus n = {n}. Please use larger primes p and q (e.g. n > 128).")

    cipher_values = [mod_pow(code, e, n) for code in ascii_values]
    ciphertext_str = " ".join(str(c) for c in cipher_values)

    return {
        "message": message,
        "type": "text",
        "characters": chars,
        "ascii_values": ascii_values,
        "formula": f"c_i = (ascii_i^{e}) mod {n}",
        "cipher_list": [str(c) for c in cipher_values],
        "ciphertext": ciphertext_str
    }


def decrypt_rsa(ciphertext: str, d: int, n: int) -> Dict[str, Any]:
    """
    Decrypts a ciphertext string using private key (d, n):
        m = (c ^ d) mod n
    """
    # Parse whitespace or comma-separated ciphertext integers
    tokens = ciphertext.replace(",", " ").split()
    if not tokens:
        raise ValueError("Please provide ciphertext integers to decrypt.")

    cipher_ints = [int(t) for t in tokens]
    decrypted_codes = [mod_pow(c, d, n) for c in cipher_ints]

    # Try to convert back to characters
    try:
        decrypted_chars = [chr(code) for code in decrypted_codes]
        decrypted_text = "".join(decrypted_chars)
    except (ValueError, OverflowError):
        decrypted_text = " ".join(str(code) for code in decrypted_codes)

    return {
        "ciphertext": ciphertext,
        "cipher_ints": cipher_ints,
        "formula": f"m_i = (c_i^{d}) mod {n}",
        "decrypted_codes": decrypted_codes,
        "decrypted_message": decrypted_text
    }

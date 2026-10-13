"""
RSA Key Generation Engine
=========================
Executes the core RSA Key Generation algorithm required by the course project:

Step 1: Choose/generate prime number p.
Step 2: Choose/generate prime number q.
Step 3: Calculate modulus n = p * q.
Step 4: Calculate Euler's totient φ(n) = (p - 1) * (q - 1).
Step 5: Select public exponent e such that gcd(e, φ(n)) = 1.
Step 6: Calculate private exponent d such that (e * d) mod φ(n) = 1.
Result: Public Key = (e, n) and Private Key = (d, n).
"""

from typing import Dict, Any, Optional
from .math_core import is_prime, generate_prime, gcd, mod_inverse


def generate_rsa_keys(
    p_input: Optional[int] = None,
    q_input: Optional[int] = None,
    e_input: Optional[int] = None,
    bits: int = 16
) -> Dict[str, Any]:
    """
    Generates an RSA key pair following the standard 6-step method.
    
    Supports:
    - User-provided primes p and q (e.g. p=61, q=53 or p=17, q=11)
    - Automatic random prime generation of specified bit size
    - Optional custom public exponent e
    """
    # Step 1: Prime p
    if p_input is not None:
        p = int(p_input)
        if not is_prime(p):
            raise ValueError(f"Number p = {p} is NOT a prime number. Please enter a valid prime.")
    else:
        p = generate_prime(bits // 2)

    # Step 2: Prime q
    if q_input is not None:
        q = int(q_input)
        if not is_prime(q):
            raise ValueError(f"Number q = {q} is NOT a prime number. Please enter a valid prime.")
        if p == q:
            raise ValueError("Primes p and q must be distinct (p != q).")
    else:
        while True:
            q = generate_prime(bits // 2)
            if q != p:
                break

    # Step 3: Calculate n = p * q
    n = p * q

    # Step 4: Calculate φ(n) = (p - 1) * (q - 1)
    phi = (p - 1) * (q - 1)

    # Step 5: Choose public exponent e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1
    if e_input is not None and e_input > 1:
        e = int(e_input)
        if e >= phi:
            raise ValueError(f"Public exponent e ({e}) must be less than φ(n) ({phi}).")
        if gcd(e, phi) != 1:
            raise ValueError(f"Public exponent e = {e} is NOT coprime to φ(n) = {phi} (gcd is {gcd(e, phi)}). Please choose an e with gcd(e, φ(n)) = 1.")
    else:
        # Standard candidate choices for e
        candidates = [65537, 17, 3, 5, 7, 11, 13, 257]
        found = False
        for cand in candidates:
            if 1 < cand < phi and gcd(cand, phi) == 1:
                e = cand
                found = True
                break
        if not found:
            # Pick smallest odd integer coprime to phi
            e = 3
            while gcd(e, phi) != 1:
                e += 2

    # Step 6: Calculate private exponent d such that (e * d) mod φ(n) = 1
    d = mod_inverse(e, phi)

    # Mathematical Verifications
    gcd_is_one = (gcd(e, phi) == 1)
    ed_mod_phi = (e * d) % phi
    is_valid = gcd_is_one and (ed_mod_phi == 1)

    # Structured 6-step explanation for the UI
    steps = [
        {
            "step": 1,
            "title": "Choose / Generate Prime p",
            "symbol": "p",
            "formula": "p ∈ ℙ",
            "value": str(p),
            "description": f"First prime number p = {p}."
        },
        {
            "step": 2,
            "title": "Choose / Generate Prime q",
            "symbol": "q",
            "formula": "q ∈ ℙ, q ≠ p",
            "value": str(q),
            "description": f"Second prime number q = {q}."
        },
        {
            "step": 3,
            "title": "Calculate Modulus n",
            "symbol": "n",
            "formula": "n = p × q",
            "value": str(n),
            "description": f"Calculated product: {p} × {q} = {n}."
        },
        {
            "step": 4,
            "title": "Calculate Euler's Totient φ(n)",
            "symbol": "φ(n)",
            "formula": "φ(n) = (p − 1)(q − 1)",
            "value": str(phi),
            "description": f"Calculated totient: ({p} − 1) × ({q} − 1) = {p - 1} × {q - 1} = {phi}."
        },
        {
            "step": 5,
            "title": "Select Public Exponent e",
            "symbol": "e",
            "formula": "1 < e < φ(n) and gcd(e, φ(n)) = 1",
            "value": str(e),
            "description": f"Selected public exponent e = {e}. Verified gcd({e}, {phi}) = 1 (coprime)."
        },
        {
            "step": 6,
            "title": "Calculate Private Exponent d",
            "symbol": "d",
            "formula": "(e × d) mod φ(n) = 1",
            "value": str(d),
            "description": f"Calculated d = {d} using Extended Euclidean Algorithm. Check: ({e} × {d}) mod {phi} = {ed_mod_phi}."
        }
    ]

    return {
        "p": str(p),
        "q": str(q),
        "n": str(n),
        "phi": str(phi),
        "e": str(e),
        "d": str(d),
        "public_key": {"e": str(e), "n": str(n)},
        "private_key": {"d": str(d), "n": str(n)},
        "verification": {
            "gcd_e_phi": gcd(e, phi),
            "ed_mod_phi": str(ed_mod_phi),
            "is_valid": is_valid,
            "status_text": "✓ RSA key generation successful" if is_valid else "✗ RSA verification failed"
        },
        "steps": steps
    }

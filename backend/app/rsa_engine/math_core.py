"""
RSA Core Mathematics Module
============================
Simple, clear, and educational implementations of the core mathematical
algorithms used in RSA cryptography:

1. is_prime(n): Checks if a number is prime.
2. generate_prime(bits): Generates a random prime number.
3. gcd(a, b): Calculates the Greatest Common Divisor using Euclidean Algorithm.
4. extended_gcd(a, b): Extended Euclidean Algorithm for Bézout coefficients.
5. mod_inverse(e, phi): Calculates private exponent d = e^(-1) mod phi.
6. mod_pow(base, exp, mod): Fast Modular Exponentiation (Square-and-Multiply).
"""

import random
import math


def is_prime(n: int) -> bool:
    """
    Checks if a number n is prime.
    
    For small numbers (n < 1,000,000):
      Checks trial division from 2 up to sqrt(n).
      
    For larger numbers:
      Uses the standard Miller-Rabin test with 5 rounds for speed and simplicity.
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False

    # Trial division for small numbers
    if n < 1000000:
        limit = int(math.isqrt(n))
        for i in range(3, limit + 1, 2):
            if n % i == 0:
                return False
        return True

    # Miller-Rabin primality test for larger numbers
    d = n - 1
    s = 0
    while d % 2 == 0:
        d //= 2
        s += 1

    for _ in range(8):
        a = random.randint(2, n - 2)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        composite = True
        for _ in range(s - 1):
            x = (x * x) % n
            if x == n - 1:
                composite = False
                break
        if composite:
            return False

    return True


def generate_prime(bits: int = 8) -> int:
    """
    Generates a random prime number with the specified bit length.
    For small bit sizes (e.g. 8-bit), generates primes between 128 and 255.
    """
    min_val = 1 << (bits - 1)
    max_val = (1 << bits) - 1

    while True:
        # Pick a random odd candidate
        candidate = random.randint(min_val, max_val)
        if candidate % 2 == 0:
            candidate += 1
        if is_prime(candidate):
            return candidate


def gcd(a: int, b: int) -> int:
    """
    Euclidean Algorithm to find the Greatest Common Divisor of two integers a and b.
    
    How it works:
      Repeatedly computes remainder until remainder is 0.
      gcd(a, b) = gcd(b, a mod b)
    """
    a, b = abs(a), abs(b)
    while b != 0:
        a, b = b, a % b
    return a


def extended_gcd(a: int, b: int) -> tuple[int, int, int]:
    """
    Extended Euclidean Algorithm (EEA).
    
    Finds integers gcd_val, x, and y such that:
        a * x + b * y = gcd(a, b)
        
    This is used to find the modular multiplicative inverse of e modulo phi(n).
    """
    if a == 0:
        return (b, 0, 1)

    gcd_val, x1, y1 = extended_gcd(b % a, a)
    x = y1 - (b // a) * x1
    y = x1

    return (gcd_val, x, y)


def mod_inverse(e: int, phi: int) -> int:
    """
    Computes the private exponent d such that:
        (e * d) mod phi = 1
        
    Uses the Extended Euclidean Algorithm:
        e * x + phi * y = gcd(e, phi) = 1
        => d = x mod phi
    """
    gcd_val, x, _ = extended_gcd(e, phi)
    if gcd_val != 1:
        raise ValueError(f"Modular inverse does not exist because gcd({e}, {phi}) = {gcd_val} != 1.")
    return (x % phi + phi) % phi


def mod_pow(base: int, exp: int, mod: int) -> int:
    """
    Fast Modular Exponentiation using Binary Square-and-Multiply:
    Computes (base^exp) % mod in O(log exp) time.
    
    Algorithm:
    1. If current bit of exponent is 1, multiply result by base mod m.
    2. Square the base mod m.
    3. Shift exponent right by 1 (divide by 2).
    """
    if mod == 1:
        return 0
    result = 1
    base = base % mod
    while exp > 0:
        if exp % 2 == 1:
            result = (result * base) % mod
        exp //= 2
        base = (base * base) % mod
    return result

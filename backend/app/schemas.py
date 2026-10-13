"""
Pydantic Schemas for RSA Key Generation System
==============================================
Straightforward request and response models for undergraduate CNS project.
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class KeyGenRequest(BaseModel):
    p: Optional[int] = Field(None, description="Optional manual prime p (e.g. 61 or 17)")
    q: Optional[int] = Field(None, description="Optional manual prime q (e.g. 53 or 11)")
    e: Optional[int] = Field(None, description="Optional public exponent e (e.g. 17 or 65537)")
    bits: int = Field(default=16, description="Bit length for automatic prime generation (e.g. 8, 16, 32, 64)")
    label: Optional[str] = Field(None, description="Optional label for history record")


class StepItem(BaseModel):
    step: int
    title: str
    symbol: str
    formula: str
    value: str
    description: str


class VerificationResult(BaseModel):
    gcd_e_phi: int
    ed_mod_phi: str
    is_valid: bool
    status_text: str


class KeyGenResponse(BaseModel):
    id: Optional[int] = None
    p: str
    q: str
    n: str
    phi: str
    e: str
    d: str
    public_key: Dict[str, str]
    private_key: Dict[str, str]
    verification: VerificationResult
    steps: List[StepItem]
    created_at: Optional[str] = None


class EncryptRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Plaintext text or number to encrypt")
    e: int = Field(..., description="Public exponent e")
    n: int = Field(..., description="Modulus n")


class EncryptResponse(BaseModel):
    message: str
    type: str
    m: Optional[str] = None
    characters: Optional[List[str]] = None
    ascii_values: Optional[List[int]] = None
    formula: str
    ciphertext: str
    cipher_list: List[str]


class DecryptRequest(BaseModel):
    ciphertext: str = Field(..., min_length=1, description="Ciphertext number(s) to decrypt")
    d: int = Field(..., description="Private exponent d")
    n: int = Field(..., description="Modulus n")


class DecryptResponse(BaseModel):
    ciphertext: str
    formula: str
    decrypted_codes: List[int]
    decrypted_message: str


class KeyRecord(BaseModel):
    id: int
    created_at: str
    label: Optional[str] = None
    p: str
    q: str
    n: str
    phi: str
    e: str
    d: str

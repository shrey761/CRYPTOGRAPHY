"""
RSA API Router
==============
Provides clean, simple REST endpoints for RSA Key Generation,
Encryption, Decryption, and SQLite History.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from ..database import get_db
from ..models import RSAKeyRecord
from ..schemas import (
    KeyGenRequest, KeyGenResponse,
    EncryptRequest, EncryptResponse,
    DecryptRequest, DecryptResponse,
    KeyRecord
)
from ..rsa_engine import generate_rsa_keys, encrypt_rsa, decrypt_rsa

router = APIRouter(prefix="/rsa", tags=["RSA Key Generation & Operations"])


@router.post("/generate", response_model=KeyGenResponse, status_code=status.HTTP_201_CREATED)
def generate_key_pair(payload: KeyGenRequest, db: Session = Depends(get_db)):
    """
    Core Requirement:
    1. Choose/generate two primes p and q.
    2. Calculate n = p * q.
    3. Calculate φ(n) = (p - 1) * (q - 1).
    4. Choose e such that gcd(e, φ(n)) = 1.
    5. Calculate d such that (e * d) mod φ(n) = 1.
    6. Display Public Key = (e, n) and Private Key = (d, n).
    """
    try:
        result = generate_rsa_keys(
            p_input=payload.p,
            q_input=payload.q,
            e_input=payload.e,
            bits=payload.bits
        )

        # Save to SQLite database
        now = datetime.now(timezone.utc)
        record = RSAKeyRecord(
            key_size=int(payload.bits),
            label=payload.label or f"RSA Key (p={result['p']}, q={result['q']})",
            p=result["p"],
            q=result["q"],
            n=result["n"],
            phi=result["phi"],
            e=result["e"],
            d=result["d"],
            is_verified=result["verification"]["is_valid"],
            created_at=now
        )
        db.add(record)
        db.commit()
        db.refresh(record)

        return {
            **result,
            "id": record.id,
            "created_at": record.created_at.isoformat()
        }

    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Key generation failed: {str(ex)}")


@router.post("/encrypt", response_model=EncryptResponse)
def encrypt_message(payload: EncryptRequest):
    """
    Encrypts a message using public key (e, n):
        c = (m ^ e) mod n
    """
    try:
        return encrypt_rsa(message=payload.message, e=payload.e, n=payload.n)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Encryption error: {str(ex)}")


@router.post("/decrypt", response_model=DecryptResponse)
def decrypt_ciphertext(payload: DecryptRequest):
    """
    Decrypts a ciphertext using private key (d, n):
        m = (c ^ d) mod n
    """
    try:
        return decrypt_rsa(ciphertext=payload.ciphertext, d=payload.d, n=payload.n)
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as ex:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Decryption error: {str(ex)}")


@router.get("/history", response_model=list[KeyRecord])
def get_key_history(db: Session = Depends(get_db)):
    """
    Retrieves previous key generation records from SQLite database.
    """
    records = db.query(RSAKeyRecord).order_by(RSAKeyRecord.id.desc()).all()
    return [
        KeyRecord(
            id=r.id,
            created_at=r.created_at.isoformat() if r.created_at else "",
            label=r.label,
            p=r.p,
            q=r.q,
            n=r.n,
            phi=r.phi,
            e=r.e,
            d=r.d
        )
        for r in records
    ]


@router.delete("/history/{record_id}", status_code=status.HTTP_200_OK)
def delete_history_record(record_id: int, db: Session = Depends(get_db)):
    """
    Deletes a specific key record from SQLite database.
    """
    record = db.query(RSAKeyRecord).filter(RSAKeyRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Key record #{record_id} not found.")
    db.delete(record)
    db.commit()
    return {"message": f"Key record #{record_id} deleted successfully."}


@router.delete("/history", status_code=status.HTTP_200_OK)
def clear_history(db: Session = Depends(get_db)):
    """
    Clears all key generation records from SQLite database.
    """
    count = db.query(RSAKeyRecord).delete()
    db.commit()
    return {"message": f"Successfully deleted {count} key records."}

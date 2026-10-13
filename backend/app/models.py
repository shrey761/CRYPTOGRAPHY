"""
SQLAlchemy Data Models
======================
Schema for storing generated RSA key history records.
Clearly flagged as academic/educational demo storage.
"""

from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float
from .database import Base


class RSAKeyRecord(Base):
    __tablename__ = "rsa_key_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    key_size = Column(Integer, nullable=False, index=True)
    label = Column(String(120), nullable=True)

    # Mathematical components stored as decimal strings to preserve arbitrary-precision integers
    p = Column(Text, nullable=False)
    q = Column(Text, nullable=False)
    n = Column(Text, nullable=False)
    phi = Column(Text, nullable=False)
    e = Column(Text, nullable=False)
    d = Column(Text, nullable=False)

    # Verification and metadata
    is_verified = Column(Boolean, default=True)
    generation_time_ms = Column(Float, default=0.0)
    storage_classification = Column(String(100), default="EDUCATIONAL_DEMO_STORAGE_NOT_FOR_PRODUCTION")

    def to_dict(self):
        return {
            "id": self.id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "key_size": self.key_size,
            "label": self.label,
            "p": self.p,
            "q": self.q,
            "n": self.n,
            "phi": self.phi,
            "e": self.e,
            "d": self.d,
            "is_verified": self.is_verified,
            "generation_time_ms": self.generation_time_ms,
            "storage_classification": self.storage_classification
        }

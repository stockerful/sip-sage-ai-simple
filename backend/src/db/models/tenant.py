from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class WineryTenant(Base):
    __tablename__ = "winery_tenants"

    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)

    def __repr__(self):
        return f"<WineryTenant {self.name}>"

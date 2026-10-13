"""
FastAPI Server Launcher
=======================
Starts the uvicorn development server on port 8000.
"""

import uvicorn

if __name__ == "__main__":
    print("Starting RSA Cryptosystem Backend on http://127.0.0.1:8000...")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

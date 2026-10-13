# RSA Key Generation System

**Course Project:** Cryptography and Network Security (CNS)  
**Implementation:** Full-Stack Web Application (Python FastAPI + React.js Vite + SQLite)

---

## 📌 Project Overview

This project is an undergraduate-level implementation of the **RSA Key Generation System**. It demonstrates how asymmetric cryptographic keys are mathematically constructed from two prime numbers $p$ and $q$, and proves their validity through simple encryption and decryption.

---

## 📐 The 6 Mathematical Steps of RSA

The application demonstrates the exact 6 steps required by the RSA algorithm:

1. **Step 1 — Choose/Generate Prime $p$:**  
   Select a prime integer $p$ (e.g. $p = 61$).
2. **Step 2 — Choose/Generate Prime $q$:**  
   Select a second distinct prime integer $q$ (e.g. $q = 53$).
3. **Step 3 — Compute Modulus $n$:**  
   $$n = p \times q = 61 \times 53 = 3233$$
4. **Step 4 — Calculate Euler's Totient $\phi(n)$:**  
   $$\phi(n) = (p - 1)(q - 1) = (61 - 1)(53 - 1) = 60 \times 52 = 3120$$
5. **Step 5 — Select Public Exponent $e$:**  
   Choose an integer $e$ such that $1 < e < \phi(n)$ and:
   $$\gcd(e, \phi(n)) = 1 \quad (\text{e.g. } e = 17, \gcd(17, 3120) = 1)$$
6. **Step 6 — Calculate Private Exponent $d$:**  
   Find $d$ such that:
   $$(e \times d) \pmod{\phi(n)} = 1$$
   Using the Extended Euclidean Algorithm: $d = 2753$, because $(17 \times 2753) \pmod{3120} = 46801 \pmod{3120} = 1$.

### 🔑 Generated Keys:
- **Public Key:** $(e, n) = (17, 3233)$
- **Private Key:** $(d, n) = (2753, 3233)$

---

## 🔒 Encryption & Decryption Formulae

- **Encryption (using Public Key $e, n$):**  
  $$c = (m^e) \bmod n$$
- **Decryption (using Private Key $d, n$):**  
  $$m = (c^d) \bmod n$$

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Python, FastAPI, Pydantic
- **Database:** SQLite (persists generated key records)
- **Math Logic:** Pure Python implementation of Euclidean Algorithm, Extended Euclidean Algorithm, and Modular Exponentiation.

---

## 🚀 How to Run the Project

### Option 1: Quick PowerShell Launcher (Windows)
```powershell
cd rsa-cryptosystem
.\start_servers.ps1
```

### Option 2: Run Manually in Separate Terminals

#### Terminal 1 — Backend (FastAPI):
```bash
cd backend
pip install -r requirements.txt
python run.py
```
*Backend runs on: `http://127.0.0.1:8000` (Swagger docs at `/docs`)*

#### Terminal 2 — Frontend (React):
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on: `http://localhost:5173`*

---

## 🧪 Automated Unit Tests

Run the test suite with:
```bash
cd backend
python -m pytest
```
*All 10 tests verify primality testing, GCD, Extended Euclidean Algorithm, key generation, and encryption/decryption.*

import React from 'react';
import { BookOpen, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function VivaGuide() {
  const questions = [
    {
      q: '1. What is RSA and why is it called an Asymmetric Cryptosystem?',
      a: 'RSA is a public-key cryptosystem invented by Ron Rivest, Adi Shamir, and Leonard Adleman in 1977. It is asymmetric because it uses TWO different keys: a Public Key (e, n) for encryption, and a mathematically related Private Key (d, n) for decryption. Anyone can encrypt a message with the public key, but only the holder of the private key can decrypt it.',
    },
    {
      q: '2. What are the 6 basic steps to generate RSA keys?',
      a: 'Step 1: Pick two distinct prime numbers p and q.\nStep 2: Calculate modulus n = p * q.\nStep 3: Calculate Euler’s Totient φ(n) = (p - 1) * (q - 1).\nStep 4: Choose a public exponent e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1 (coprime).\nStep 5: Calculate private exponent d such that (e * d) mod φ(n) = 1 (using Extended Euclidean Algorithm).\nStep 6: Public Key = (e, n) and Private Key = (d, n).',
    },
    {
      q: '3. What is Euler\'s Totient Function φ(n)?',
      a: 'Euler’s Totient function φ(n) counts the number of positive integers less than n that are coprime to n (i.e. gcd(k, n) = 1). Because p and q are prime, φ(p) = p - 1 and φ(q) = q - 1. Because the totient function is multiplicative for coprime numbers: φ(n) = φ(p * q) = (p - 1)(q - 1).',
    },
    {
      q: '4. Why must gcd(e, φ(n)) = 1?',
      a: 'For a modular multiplicative inverse d = e^(-1) mod φ(n) to exist, e and φ(n) must share no common factors other than 1 (i.e. they must be coprime). If gcd(e, φ(n)) != 1, we cannot calculate a valid private key d.',
    },
    {
      q: '5. How are encryption and decryption computed?',
      a: 'Encryption: Ciphertext c = (m ^ e) mod n (computed using Public Key e and n).\nDecryption: Plaintext m = (c ^ d) mod n (computed using Private Key d and n).\nThis roundtrip works because of Euler\'s Totient Theorem: m^(e * d) ≡ m^(1 + k*φ(n)) ≡ m (mod n).',
    },
    {
      q: '6. What is the mathematical security of RSA based on?',
      a: 'The security of RSA relies on the difficulty of integer factorization (the Trapdoor One-Way Function). While it is easy to multiply two large primes n = p * q, it is computationally infeasible to factor n back into p and q for sufficiently large numbers without knowing p or q in advance.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-emerald-900/40 via-slate-900 to-cyan-900/40 border border-emerald-500/30 shadow-lg">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-emerald-400" />
          <span>Viva Defense &amp; Quick Theory Reference</span>
        </h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-1">
          Simple, undergraduate-level explanations to help you explain and defend your RSA project during viva exams.
        </p>
      </div>

      {/* Q&A Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-2.5"
          >
            <div className="flex items-start gap-2">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <h3 className="font-bold text-slate-100 text-sm">{item.q}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pl-6 whitespace-pre-line">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

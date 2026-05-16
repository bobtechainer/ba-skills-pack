# OWASP Top 10 + STRIDE Threat Modeling — Security Plan Reference

Practical security cheat sheet for writing Security Plan / Threat Model for banking applications.

## OWASP Top 10 — Web Application (2021)

Every banking web app Security Plan MUST address each item explicitly. If a category doesn't apply, state why.

| # | Category | Key mitigations for banking apps |
|---|---|---|
| A01 | Broken Access Control | RBAC/ABAC per customer record, never trust client-side checks, audit every sensitive access |
| A02 | Cryptographic Failures | TLS 1.2+, strong ciphers only, at-rest encryption, proper key management, no MD5/SHA-1 for hashing |
| A03 | Injection | Parameterized queries, ORM with prepared statements, input validation at trust boundaries, WAF |
| A04 | Insecure Design | Threat modeling (STRIDE), secure-by-default, rate limiting on sensitive flows |
| A05 | Security Misconfiguration | Harden OS/DB/App servers, remove default accounts, disable unused features, patch cadence |
| A06 | Vulnerable & Outdated Components | SCA scanning (Snyk, Dependabot), patching SLA, SBOM per release |
| A07 | Identification & Authentication Failures | Strong password policy, MFA mandatory, session timeout, account lockout, credential stuffing protection |
| A08 | Software & Data Integrity Failures | Signed builds, integrity checks on code/config, trusted repositories only |
| A09 | Security Logging & Monitoring Failures | Structured audit log, SIEM integration, alerts on suspicious patterns, log retention per regulation |
| A10 | Server-Side Request Forgery (SSRF) | Allowlist outbound destinations, metadata service block, network segmentation |

## OWASP API Security Top 10 (2023)

For REST/GraphQL APIs — required coverage in API Spec and Security Plan:

1. **BOLA** (Broken Object Level Authorization) — customer A sees customer B's wallet. Fix: per-object authz checks in every handler.
2. **Broken Authentication** — weak session tokens, no refresh, leaked JWT. Fix: short-lived access tokens + refresh, secure storage.
3. **Broken Object Property Level Authorization** — field-level leak (exposing internal fields). Fix: explicit response schema allowlisting.
4. **Unrestricted Resource Consumption** — no rate limit, no quota. Fix: per-user and per-IP rate limit, circuit breakers.
5. **Broken Function Level Authorization** — admin endpoint accessible to normal user. Fix: role check middleware on admin routes.
6. **Unrestricted Access to Sensitive Business Flows** — no anti-automation on "open FD" flow. Fix: CAPTCHA, device fingerprint, velocity check.
7. **Server-Side Request Forgery** — same as OWASP A10.
8. **Security Misconfiguration** — default admin creds, exposed debug endpoints. Fix: config review pre-prod.
9. **Improper Inventory Management** — old API versions still live. Fix: API inventory + deprecation process.
10. **Unsafe Consumption of APIs** — trusting upstream data without validation. Fix: validate all external responses.

## STRIDE Threat Modeling

STRIDE (Microsoft, 1999) maps threats to properties being violated:

| Threat | Property violated | Example in banking app |
|---|---|---|
| **S**poofing | Authentication | Attacker uses stolen OTP to impersonate customer |
| **T**ampering | Integrity | Attacker modifies transaction amount in flight |
| **R**epudiation | Non-repudiation | Customer denies making a transaction, no audit proof |
| **I**nformation Disclosure | Confidentiality | Customer A sees customer B's balance via URL parameter manipulation |
| **D**enial of Service | Availability | Bot farm overwhelms /spin endpoint during peak |
| **E**levation of Privilege | Authorization | Regular user accesses admin dashboard via URL guessing |

### STRIDE process (per HLD container)

For each container in the C4 Container diagram, walk through STRIDE:

```
Container: Rule Engine (FastAPI service)

S - Spoofing:
    Threat: Fake transaction event injected into event bus
    Mitigation: mTLS between services + signed event payloads (JWT / HMAC)

T - Tampering:
    Threat: DB row update race condition on prize_pool
    Mitigation: Row-level lock SELECT FOR UPDATE, or Redis atomic DECR

R - Repudiation:
    Threat: Customer disputes round award
    Mitigation: Append-only transaction_ledger with cryptographic hash chain

I - Information Disclosure:
    Threat: /wallet/{id} returns other customer data if id mismatches auth
    Mitigation: Extract customer_id from JWT, ignore URL path param; authz check mandatory

D - Denial of Service:
    Threat: Bot farm exhausts prize pool via /spin spam
    Mitigation: Per-customer rate limit (3/day for QR rounds), per-IP rate limit, device fingerprint

E - Elevation of Privilege:
    Threat: Admin API reachable from customer app routes
    Mitigation: Separate network zone for admin, separate auth context (admin_role claim check)
```

### Threat register format

```
THREAT-001
Category: Spoofing (STRIDE-S)
Description: Attacker replays captured OTP to open FD on behalf of victim
Affected components: [Client App] → Account Service → Rule Engine
Likelihood: Medium (OTP interception requires either phishing or SS7 compromise)
Impact: High (unauthorized FD, rounds awarded to attacker)
Risk rating: Medium × High = High
Mitigation(s):
  - M1: Short OTP TTL (60s)
  - M2: Device binding (OTP tied to device fingerprint)
  - M3: Transaction amount confirmation (OTP scope includes amount, refuses if tampered)
Residual risk after mitigations: Low
Owner: [Client] Security Team
Status: Mitigated
Evidence: Penetration test report §4.3 (2026-03-15)
```

## Banking-specific threat considerations

Beyond OWASP and STRIDE, banking apps face:

1. **Fraud / gaming** — Farmers creating fake accounts to collect promotional rewards. Mitigation: KYC + device fingerprint + behavioral analytics.
2. **ATO** (Account Takeover) — Credential stuffing from breached password dumps. Mitigation: MFA, password breach detection (HIBP), anomaly detection.
3. **Man-in-the-browser** — Malware modifying DOM to steal credentials or amounts. Mitigation: client-side integrity checks, out-of-band confirmation (SMS), hardware tokens for high-value transactions.
4. **Mobile-specific** — jailbreak detection, certificate pinning, code obfuscation, anti-debugging, RASP (runtime app self-protection).
5. **Regulatory** — KYC/AML checks, sanctions list screening, transaction monitoring rules.

## STRIDE + DFD method

Combine STRIDE with a **Data Flow Diagram** (DFD):

1. Draw system as DFD: external entities, processes, data stores, data flows.
2. Mark **trust boundaries** (where trust level changes — e.g., client-server boundary, internal-external API boundary).
3. Apply STRIDE to each **element type**:
   - External entity: S, R
   - Process: S, T, R, I, D, E
   - Data store: T, R, I, D
   - Data flow: T, I, D
4. For each applicable threat, document mitigation and residual risk.

## References

- OWASP Top 10 2021 (owasp.org/Top10)
- OWASP API Security Top 10 2023 (owasp.org/API-Security)
- Adam Shostack, *Threat Modeling: Designing for Security* (2014)
- Microsoft STRIDE methodology
- Thông tư 09/2020/TT-NHNN (for regulatory requirements)
- NIST SP 800-30 — Risk Assessment Guide

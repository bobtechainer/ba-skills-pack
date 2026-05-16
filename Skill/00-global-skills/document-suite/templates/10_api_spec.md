<!--
Template: api_spec — API Specification / Đặc tả API
Standard: OpenAPI 3.0 + RFC 9457 (Problem Details) + RFC 7807 conventions
Skill:    banking-docs
Version:  2.0.0
Usage:    node scripts/build_doc.js <folder> --brand <vendor> --client <client>
-->

# Đặc tả API / API Specification

**Project**: {{facts.project.name}} — {{facts.project.code}}
**Client**: {{facts.client.name}}
**Vendor**: {{facts.vendor.name}}
**Version**: {{facts.doc.version}}
**Date**: {{facts.doc.date}}
**Classification**: {{facts.doc.classification}}

> All HTTP APIs follow OpenAPI 3.0. Errors follow RFC 9457 (`application/problem+json`). The machine-readable contract lives at `/api/openapi.yaml` and is the source of truth — this document is the human-readable narrative companion.

<!-- PAGE_BREAK -->

## 1. Tổng quan API / API Overview

<!-- FILL: One paragraph: what the API does, who consumes it, transport, base URL, content type, charset. -->

**What goes here**:
- API name + business purpose
- Consumers (mobile SDK, partner banks, internal services)
- Transport (HTTPS only, TLS 1.2+)
- Base URL pattern per environment
- Content type, charset, date/time format

**Environment matrix**:

| Environment | Base URL | Cert Auth | Notes |
|---|---|---|---|
| Sandbox | `https://api-sandbox.{{facts.vendor.domain}}/v1` | Public CA | Synthetic data only |
| UAT | `https://api-uat.{{facts.client.domain}}/v1` | Public CA | Client-controlled |
| Production | `https://api.{{facts.client.domain}}/v1` | mTLS + public | <!-- FILL --> |

**Conventions**:
- Content-Type: `application/json; charset=utf-8`
- Date-time: ISO 8601 with timezone, e.g., `2026-04-13T09:30:00+07:00`
- Pagination: cursor-based via `page[after]`/`page[size]`
- Idempotency: required on all unsafe writes via `Idempotency-Key` header

<!-- PAGE_BREAK -->

## 2. Xác thực & Phân quyền / Authentication & Authorization

<!-- FILL: Specify the auth flows for each consumer class. Banking regulators expect explicit scopes and short token lifetimes. -->

**Authentication summary**:

| Consumer | Mechanism | Token Lifetime | Refresh Strategy |
|---|---|---|---|
| Mobile SDK (end-user) | OAuth 2.0 PKCE → JWT access | 15 min | Refresh token 30 d, rotated |
| Server-to-server (internal) | OAuth 2.0 client-credentials → JWT | 60 min | Re-acquire on expiry |
| Partner / 3rd-party | mTLS + OAuth client-credentials | 60 min | Re-acquire on expiry |

**JWT structure (claims)**:

| Claim | Source | Purpose |
|---|---|---|
| `iss` | Auth server | Issuer URL |
| `sub` | User / client id | Principal |
| `aud` | Resource server | Token audience |
| `exp` | Auth server | Expiry (epoch seconds) |
| `scope` | Auth server | Space-separated permissions |
| `tenant` | Custom | Multi-tenant routing |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

**Scopes**:

| Scope | Grants |
|---|---|
| `application:read` | Read own application(s) |
| `application:write` | Submit / update application |
| `decision:approve` | Render approval / rejection (officer only) |
| `vault:pii.read` | Read decrypted PII (privileged) |
| <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 3. Giới hạn & Hạn ngạch / Rate Limiting & Quotas

<!-- FILL: Explicit limits per consumer class. Return 429 with Retry-After header on breach. -->

**Rate limit policy**:

| Consumer Class | Limit | Window | Burst |
|---|---|---|---|
| Mobile SDK (per user) | 60 req | 60 s | 10 |
| Mobile SDK (per IP) | 600 req | 60 s | 50 |
| Internal service | 1000 req | 60 s | 200 |
| Partner | per-contract | per-contract | per-contract |

**Headers returned on every response**:
- `X-RateLimit-Limit: <total>`
- `X-RateLimit-Remaining: <remaining>`
- `X-RateLimit-Reset: <epoch>`

**429 response includes** `Retry-After: <seconds>`.

<!-- PAGE_BREAK -->

## 4. Danh mục Endpoint / Endpoint Catalog

<!-- FILL: Master index of every endpoint. Detailed contracts in §5. -->

**Endpoint index**:

| Method | Path | Purpose | Scope | Idempotent |
|---|---|---|---|---|
| POST | `/v1/applications` | Submit new application | `application:write` | Via `Idempotency-Key` |
| GET | `/v1/applications/{id}` | Fetch application | `application:read` | Yes |
| PATCH | `/v1/applications/{id}` | Update draft | `application:write` | Yes |
| POST | `/v1/applications/{id}/submit` | Submit for review | `application:write` | Via `Idempotency-Key` |
| GET | `/v1/applications` | List/search | `application:read` | Yes |
| POST | `/v1/applications/{id}/decisions` | Render decision | `decision:approve` | Via `Idempotency-Key` |
| GET | `/v1/customers/{id}` | Customer profile | `customer:read` | Yes |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 5. Endpoint Chi tiết / Detailed Endpoints

<!-- FILL: Provide narrative + sample request/response/error per endpoint. Replicate the block. -->

### 5.1 `POST /v1/applications` — Submit new application

**Purpose**: create a new onboarding application in `DRAFT` state.

**Request headers**:

| Header | Required | Example |
|---|---|---|
| `Authorization` | Yes | `Bearer <jwt>` |
| `Idempotency-Key` | Yes | `01HW2K3...` (UUIDv7 recommended) |
| `Content-Type` | Yes | `application/json; charset=utf-8` |

**Request body**:

```json
{
  "productCode": "SAVINGS_STD",
  "customer": {
    "fullName": "Nguyen Thi Linh",
    "dob": "1996-08-12",
    "idNumber": "001196000123",
    "email": "linh@example.com",
    "phone": "+84901234567"
  },
  "consents": ["TERMS_v3", "PRIVACY_v2"]
}
```

**Success response — `201 Created`**:

```json
{
  "applicationId": "01HW2K3PQRS...",
  "status": "DRAFT",
  "createdAt": "2026-04-13T09:30:00+07:00",
  "_links": {
    "self": "/v1/applications/01HW2K3PQRS..."
  }
}
```

**Error responses**:

| Status | Type | When |
|---|---|---|
| 400 | `validation-error` | Missing / malformed fields |
| 401 | `unauthenticated` | No / invalid token |
| 403 | `forbidden` | Token lacks scope |
| 409 | `duplicate-application` | Open application already exists for this customer |
| 422 | `consent-missing` | Required consents not provided |

---

### 5.2 `GET /v1/applications/{id}`

<!-- FILL: replicate the structure above. -->

**Purpose**: <!-- FILL -->

**Path parameters**: `id` — application identifier (ULID/UUID)

**Success — `200 OK`**:

```json
{
  "applicationId": "<!-- FILL -->",
  "status": "<!-- FILL -->",
  "submittedAt": "<!-- FILL -->"
}
```

**Errors**: 401, 403, 404 (`application-not-found`)

---

### 5.3 `POST /v1/applications/{id}/submit`

<!-- FILL: replicate. -->

**Purpose**: transition application from `DRAFT` → `SUBMITTED`.

**Request body**: empty.

**Success — `200 OK`** with updated application resource.

**Errors**: 401, 403, 404, 409 (`invalid-state-transition`), 422 (`incomplete-application`)

---

### 5.4 `POST /v1/applications/{id}/decisions`

<!-- FILL: replicate. -->

**Purpose**: officer renders APPROVED or REJECTED on an application.

**Request body**:

```json
{
  "outcome": "APPROVED",
  "reasonCode": "OK",
  "notes": "<!-- FILL: optional officer note -->"
}
```

**Errors**: 401, 403, 404, 409 (`already-decided`)

---

> Replicate this block for endpoints 5.5 through 5.N. Aim for 5-10 fully-documented samples; the rest can reference the OpenAPI YAML.

<!-- PAGE_BREAK -->

## 6. Schema Dữ liệu / Data Schemas

<!-- FILL: JSON Schemas for every request/response object. Maintained in OpenAPI components.schemas; mirrored here for human readers. -->

**Schema: `Application`**:

```yaml
type: object
required: [applicationId, status, createdAt]
properties:
  applicationId:
    type: string
    format: ulid
  status:
    type: string
    enum: [DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, NEEDS_INFO]
  productCode:
    type: string
  customer:
    $ref: '#/components/schemas/Customer'
  riskScore:
    type: integer
    minimum: 0
    maximum: 100
    nullable: true
  createdAt:
    type: string
    format: date-time
  submittedAt:
    type: string
    format: date-time
    nullable: true
```

**Schema: `Customer`**:

```yaml
type: object
required: [fullName, dob, idNumber]
properties:
  fullName:    { type: string, minLength: 2, maxLength: 200 }
  dob:         { type: string, format: date }
  idNumber:    { type: string, pattern: '^[0-9]{9,12}$' }
  email:       { type: string, format: email }
  phone:       { type: string, pattern: '^\\+?[0-9]{8,15}$' }
```

<!-- FILL: add Decision, Officer, Account schemas -->

<!-- PAGE_BREAK -->

## 7. Định dạng Phản hồi Lỗi / Error Response Format

<!-- FILL: Single, consistent error contract per RFC 9457. Every 4xx / 5xx returns this shape. -->

**Standard error shape (`application/problem+json`)**:

```json
{
  "type": "https://errors.{{facts.vendor.domain}}/onboarding/duplicate-application",
  "title": "Duplicate application",
  "status": 409,
  "detail": "An application for national ID 0011** is already in PENDING state.",
  "instance": "/v1/applications",
  "traceId": "abc123",
  "errors": [
    { "field": "customer.idNumber", "code": "DUPLICATE", "message": "Already in use" }
  ]
}
```

**Error type registry** (excerpt):

| Type | Status | Meaning |
|---|---|---|
| `validation-error` | 400 | Schema or field validation failed |
| `unauthenticated` | 401 | Missing / invalid credentials |
| `forbidden` | 403 | Authenticated but lacking scope |
| `application-not-found` | 404 | Resource does not exist |
| `duplicate-application` | 409 | Conflict with existing resource |
| `invalid-state-transition` | 409 | State machine guard failed |
| `consent-missing` | 422 | Required business precondition unmet |
| `rate-limited` | 429 | Quota exceeded |
| `internal-error` | 500 | Unhandled server error |
| <!-- FILL --> | <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 8. Chiến lược Phiên bản / Versioning Strategy

<!-- FILL: Banking integrations live for years; versioning policy must be unambiguous. -->

**Approach**:
- URL path versioning: `/v1`, `/v2`, etc.
- Breaking changes → new major version
- Additive changes → same version (consumers must tolerate unknown fields)
- Maximum 2 concurrent versions in production

**Compatibility rules** (within a major version):

| Allowed | Not Allowed |
|---|---|
| Add new optional field | Remove field |
| Add new endpoint | Remove endpoint |
| Add new enum value (non-required field) | Add new enum value (required field) |
| Loosen validation | Tighten validation |
| <!-- FILL --> | <!-- FILL --> |

<!-- PAGE_BREAK -->

## 9. Chính sách Loại bỏ / Deprecation Policy

<!-- FILL: Define how and when versions are sunset. Communicate via headers and partner notice. -->

**Process**:

| Stage | Duration | Mechanism |
|---|---|---|
| Announce | T-12 months | Partner email + `Deprecation` header |
| Deprecation period | 12 months minimum | `Deprecation: true` + `Sunset: <date>` headers on every response |
| Brownout | T-1, T-7, T-30 days | Scheduled outages 1h to surface dependencies |
| Sunset | T-0 | Endpoint returns `410 Gone` |

**Headers (RFC 8594, RFC 9745)**:
- `Deprecation: @1737590400` (epoch of deprecation announcement)
- `Sunset: Sat, 01 Jan 2028 00:00:00 GMT`
- `Link: <https://docs.{{facts.vendor.domain}}/migration-v1-to-v2>; rel="deprecation"`

<!-- PAGE_BREAK -->

## 10. Yêu cầu Mẫu / Example Requests

<!-- FILL: copy-paste-ready samples to lower partner integration friction. -->

**curl**:

```bash
curl -X POST 'https://api-sandbox.{{facts.vendor.domain}}/v1/applications' \
  -H 'Authorization: Bearer eyJhbGciOi...' \
  -H 'Idempotency-Key: 01HW2K3PQRSTUVWXYZ' \
  -H 'Content-Type: application/json' \
  -d '{
    "productCode": "SAVINGS_STD",
    "customer": {
      "fullName": "Nguyen Thi Linh",
      "dob": "1996-08-12",
      "idNumber": "001196000123"
    },
    "consents": ["TERMS_v3", "PRIVACY_v2"]
  }'
```

**Java (OkHttp)**:

```java
Request req = new Request.Builder()
    .url("https://api-sandbox.{{facts.vendor.domain}}/v1/applications")
    .header("Authorization", "Bearer " + token)
    .header("Idempotency-Key", UUID.randomUUID().toString())
    .post(RequestBody.create(json, MediaType.parse("application/json")))
    .build();
try (Response res = client.newCall(req).execute()) {
    // handle res
}
```

**Python (requests)**:

```python
import requests, uuid
r = requests.post(
    "https://api-sandbox.{{facts.vendor.domain}}/v1/applications",
    headers={
        "Authorization": f"Bearer {token}",
        "Idempotency-Key": str(uuid.uuid4()),
    },
    json=payload,
    timeout=5,
)
r.raise_for_status()
```

<!-- FILL: add Node.js / Go / Kotlin samples as needed -->

---

**Document Control**

| Version | Date | Author | Change Summary |
|---|---|---|---|
| 0.1 | <!-- FILL --> | <!-- FILL --> | Initial draft |
| 1.0 | {{facts.doc.date}} | {{facts.vendor.name}} | Baselined; OpenAPI YAML committed |

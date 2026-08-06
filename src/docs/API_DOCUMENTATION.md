# KAEVY STUDIO — REST API DOCUMENTATION (RC1)

**Version**: 1.0.0 (Release Candidate 1)  
**Base URL**: `/api/v1`  
**Response Format**: All endpoints return standard `{ success: boolean, data?: T, error?: { code: string, message: string } }` JSON responses.

---

## 🔑 Authentication & Headers

Protected routes require an `Authorization` header containing a Bearer token:
```http
Authorization: Bearer kaevy_token_<user_id>
```

### Pre-seeded Demo Tokens:
- **Client Account**: `kaevy_token_50000000-0000-0000-0000-000000000002`
- **Developer Account**: `kaevy_token_50000000-0000-0000-0000-000000000003`
- **Admin Account**: `kaevy_token_50000000-0000-0000-0000-000000000001`

---

## 📌 Endpoint Reference

### 1. Health & Core
- `GET /api/v1/health`
  - **Auth**: Public
  - **Response**: `{ success: true, data: { status: "ok", timestamp: "..." } }`

---

### 2. Services & Marketplace Catalog
- `GET /api/v1/services`
  - **Auth**: Public
  - **Query Params**: `categoryId`, `minPrice`, `maxPrice`, `search`, `page`, `limit`
  - **Response**: List of published services with developer and category information.

- `GET /api/v1/services/:id`
  - **Auth**: Public
  - **Response**: Single service details.

- `POST /api/v1/services`
  - **Auth**: Developer / Admin
  - **Body**: `{ title, categoryId, description, basePrice, baseCurrency, estimatedDeliveryDays }`
  - **Response**: Created service DTO.

---

### 3. Developer Directory
- `GET /api/v1/developers`
  - **Auth**: Public
  - **Query Params**: `specialization`, `tier`, `search`, `page`, `limit`
  - **Response**: List of developer profiles with stats and completion history.

- `GET /api/v1/developers/:id`
  - **Auth**: Public
  - **Response**: Developer detail profile with active project capacity.

---

### 4. Orders & Projects Lifecycle
- `POST /api/v1/orders`
  - **Auth**: Client / Admin
  - **Body**: `{ serviceId, customScopeDescription, customAgreedPrice, customAgreedCurrency }`
  - **Response**: Created order with locked snapshot values.

- `GET /api/v1/orders`
  - **Auth**: Protected
  - **Response**: Orders filtered by authenticated user role.

- `GET /api/v1/orders/:orderNumber`
  - **Auth**: Protected
  - **Response**: Specific order details.

- `PATCH /api/v1/orders/:orderNumber/accept`
  - **Auth**: Developer
  - **Response**: Updated order status (`ACCEPTED`) and initialized project record.

- `PATCH /api/v1/orders/:orderNumber/reject`
  - **Auth**: Developer
  - **Body**: `{ reason?: string }`
  - **Response**: Updated order status (`REJECTED`).

---

### 5. Projects & Milestones
- `GET /api/v1/projects/:id`
  - **Auth**: Protected
  - **Response**: Project detail with milestone progression (30%, 60%, 100%).

- `POST /api/v1/projects/:id/milestones/:percentage/submit`
  - **Auth**: Developer
  - **Body**: `{ notes, deliverableUrl }`
  - **Response**: Updated milestone state (`SUBMITTED`).

- `POST /api/v1/projects/:id/milestones/:percentage/approve`
  - **Auth**: Client
  - **Response**: Approved milestone, escrow payout trigger, and automatic 30-day warranty creation on 100% completion.

---

### 6. Digital Assets Marketplace
- `GET /api/v1/assets`
  - **Auth**: Public
  - **Query Params**: `categoryId`, `fileType`, `search`
  - **Response**: Approved shareable assets catalog.

- `POST /api/v1/assets`
  - **Auth**: Protected
  - **Body**: `{ title, categoryId, priceAmount, currency, documentationBlocks, tags }`
  - **Response**: Created asset entry pending review.

---

### 7. Warranties & Disputes
- `GET /api/v1/warranties/:id`
  - **Auth**: Protected
  - **Response**: Active warranty guarantee details (30-day window).

- `POST /api/v1/disputes`
  - **Auth**: Protected
  - **Body**: `{ orderId, reason, description }`
  - **Response**: Opened dispute case for arbitration.

---

### 8. Notifications
- `GET /api/v1/notifications`
  - **Auth**: Protected
  - **Response**: User notification feed.

- `PATCH /api/v1/notifications/:id/read`
  - **Auth**: Protected
  - **Response**: Notification marked as read.

---

## 🛑 Error Response Contract

All errors follow the unified schema:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description."
  }
}
```

Common status codes:
- `400`: Bad Request / Invalid State Transition (`ORDER_INVALID_STATE`)
- `401`: Unauthorized / Missing Token (`AUTH_REQUIRED`)
- `403`: Forbidden / Insufficient Role (`FORBIDDEN`)
- `404`: Not Found (`SERVICE_NOT_FOUND`, `ORDER_NOT_FOUND`)
- `409`: Conflict / Developer Capacity Exceeded (`CAPACITY_FULL`)
- `422`: Unprocessable Entity / Validation Error (`VALIDATION_ERROR`)
- `500`: Internal Server Error (`INTERNAL_SERVER_ERROR`)

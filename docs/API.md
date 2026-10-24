# ASTRA App - Backend API Routes

All endpoints use JSON payloads and return standardized responses. In this skeleton version, endpoints return hardcoded placeholder structures or HTTP 501 Not Implemented stubs.

| Method | Path | Description | Access / Role | Implementation Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | Service health status check | Public | Implemented (`{ status: "ok" }`) |
| `POST` | `/auth/login` | Login with credentials or token | Public | Stub (TODO: AI/Backend) |
| `GET` | `/auth/me` | Fetch authenticated member profile | Authenticated | Stub (TODO: AI/Backend) |
| `GET` | `/members/me/id` | Get digital ID data and QR token | Authenticated | Stub (TODO: AI/Backend) |
| `GET` | `/verify/:token` | Validate digital ID QR token | Officer / Partner | Stub (TODO: AI/Backend) |
| `GET` | `/points/me` | Get member current points balance | Authenticated | Stub (TODO: AI/Backend) |
| `GET` | `/points/me/history` | Get member points transaction history | Authenticated | Stub (TODO: AI/Backend) |
| `POST` | `/points/grant` | Grant points to a member | Officer | Stub (TODO: AI/Backend) |
| `GET` | `/events` | List upcoming and past events | Authenticated | Stub (TODO: AI/Backend) |
| `POST` | `/events/:id/checkin` | Check in member to an event | Authenticated | Stub (TODO: AI/Backend) |
| `GET` | `/perks` | List available partner perks | Authenticated | Stub (TODO: AI/Backend) |
| `POST` | `/perks/:id/redeem` | Redeem points for partner voucher | Authenticated | Stub (TODO: AI/Backend) |
| `GET` | `/vouchers/me` | List vouchers claimed by current member | Authenticated | Stub (TODO: AI/Backend) |
| `GET` | `/vouchers/:id` | Get details and status of voucher | Authenticated | Stub (TODO: AI/Backend) |
| `GET` | `/astrascend/opportunities` | List active ASTRAscend service opportunities | Public | Stub (TODO: AI/Backend) |

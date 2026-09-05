# API Documentation

Base URL:

```
http://localhost:3000/api
```

All endpoints are prefixed with `/todos` (e.g. `POST /api/todos`). All responses are JSON.

---

## Create Todo

`POST /todos`

Creates a new todo. Request body is validated with Zod (`createTodoSchema`).

**Request body fields**

| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | string | Yes | 1–100 characters (trimmed) |
| `description` | string | No | Max 500 characters (trimmed) |
| `priority` | `"LOW" \| "MEDIUM" \| "HIGH"` | No | Defaults to `"MEDIUM"` |
| `dueDate` | string | No | Must be `YYYY-MM-DD` format |

**Example request**

```http
POST /api/todos
Content-Type: application/json

{
  "title": "Complete Ziptrrip assignment",
  "description": "Build full stack todo application",
  "priority": "HIGH",
  "dueDate": "2026-09-10"
}
```

**Example success response** — `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "0c1bec27-2dae-4be1-a31c-736406818a28",
    "title": "Complete Ziptrrip assignment",
    "description": "Build full stack todo application",
    "completed": false,
    "priority": "HIGH",
    "dueDate": "2026-09-10T00:00:00.000Z",
    "createdAt": "2026-09-05T03:56:03.811Z",
    "updatedAt": "2026-09-05T03:56:03.811Z"
  }
}
```

**Example validation error response** — `400 Bad Request`

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

**Other responses**
- `500 Internal Server Error` — `{ "success": false, "message": "Failed to create todo" }`

---

## Get All Todos

`GET /todos`

Returns a paginated list of todos, optionally filtered by search, status, and priority.

**Query parameters** (all optional)

| Parameter | Type | Notes |
|---|---|---|
| `search` | string | Case-insensitive match against `title` OR `description` (`contains`) |
| `status` | `"pending" \| "completed"` | `pending` → `completed = false`, `completed` → `completed = true`. Any other/missing value applies no status filter |
| `priority` | `"LOW" \| "MEDIUM" \| "HIGH"` | Exact match |
| `page` | number | Defaults to `1` |
| `limit` | number | Defaults to `10` |

**Example request**

```http
GET /api/todos?search=assignment&status=pending&priority=HIGH&page=1&limit=10
```

**Example success response** — `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "0c1bec27-2dae-4be1-a31c-736406818a28",
      "title": "Complete Ziptrrip assignment",
      "description": "Build full stack todo application",
      "completed": false,
      "priority": "HIGH",
      "dueDate": "2026-09-10T00:00:00.000Z",
      "createdAt": "2026-09-05T03:56:03.811Z",
      "updatedAt": "2026-09-05T04:34:12.544Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

**Other responses**
- `500 Internal Server Error` — `{ "success": false, "message": "Failed to fetch todos" }`

---

## Get Single Todo

`GET /todos/:id`

Fetches a single todo by id.

**Example request**

```http
GET /api/todos/0c1bec27-2dae-4be1-a31c-736406818a28
```

**Example success response** — `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "0c1bec27-2dae-4be1-a31c-736406818a28",
    "title": "Complete Ziptrrip assignment",
    "description": "Build full stack todo application",
    "completed": false,
    "priority": "HIGH",
    "dueDate": "2026-09-10T00:00:00.000Z",
    "createdAt": "2026-09-05T03:56:03.811Z",
    "updatedAt": "2026-09-05T04:34:12.544Z"
  }
}
```

**Other responses**
- `404 Not Found` — `{ "success": false, "message": "Todo not found" }`
- `500 Internal Server Error` — `{ "success": false, "message": "Failed to fetch todo" }`

---

## Update Todo

`PUT /todos/:id`

Updates an existing todo. All fields are optional — only include the fields you want to change. Validated with Zod (`updateTodoSchema`). The todo is looked up first; if it doesn't exist, no update is attempted.

**Request body fields**

| Field | Type | Notes |
|---|---|---|
| `title` | string | 1–100 characters (trimmed), cannot be an empty string if provided |
| `description` | string \| null | Max 500 characters (trimmed); `null` clears it |
| `priority` | `"LOW" \| "MEDIUM" \| "HIGH"` | |
| `completed` | boolean | |
| `dueDate` | string \| null | Must be `YYYY-MM-DD` if provided; `null` clears it |

**Example request**

```http
PUT /api/todos/0c1bec27-2dae-4be1-a31c-736406818a28
Content-Type: application/json

{
  "title": "Complete Ziptrrip assignment (updated)",
  "priority": "MEDIUM",
  "completed": false
}
```

**Example success response** — `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "0c1bec27-2dae-4be1-a31c-736406818a28",
    "title": "Complete Ziptrrip assignment (updated)",
    "description": "Build full stack todo application",
    "completed": false,
    "priority": "MEDIUM",
    "dueDate": "2026-09-10T00:00:00.000Z",
    "createdAt": "2026-09-05T03:56:03.811Z",
    "updatedAt": "2026-09-05T05:10:00.000Z"
  }
}
```

**Example validation error response** — `400 Bad Request`

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "dueDate",
      "message": "Due date must be in YYYY-MM-DD format"
    }
  ]
}
```

**Other responses**
- `400 Bad Request` — `{ "success": false, "message": "Todo id is required" }` (missing/invalid `:id` param)
- `404 Not Found` — `{ "success": false, "message": "Todo not found" }`
- `500 Internal Server Error` — `{ "success": false, "message": "Failed to update todo" }`

---

## Toggle Todo Status

`PATCH /todos/:id/toggle`

Flips the todo's `completed` value (`true` ↔ `false`). No request body is used.

**Example request**

```http
PATCH /api/todos/0c1bec27-2dae-4be1-a31c-736406818a28/toggle
```

**Example success response** — `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "0c1bec27-2dae-4be1-a31c-736406818a28",
    "title": "Complete Ziptrrip assignment",
    "description": "Build full stack todo application",
    "completed": true,
    "priority": "HIGH",
    "dueDate": "2026-09-10T00:00:00.000Z",
    "createdAt": "2026-09-05T03:56:03.811Z",
    "updatedAt": "2026-09-05T05:15:00.000Z"
  }
}
```

**Other responses**
- `400 Bad Request` — `{ "success": false, "message": "Todo id is required" }`
- `404 Not Found` — `{ "success": false, "message": "Todo not found" }`
- `500 Internal Server Error` — `{ "success": false, "message": "Failed to toggle todo status" }`

---

## Delete Todo

`DELETE /todos/:id`

Deletes a todo by id.

**Example request**

```http
DELETE /api/todos/0c1bec27-2dae-4be1-a31c-736406818a28
```

**Example success response** — `200 OK`

```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

**Other responses**
- `400 Bad Request` — `{ "success": false, "message": "Todo id is required" }`
- `404 Not Found` — `{ "success": false, "message": "Todo not found" }`
- `500 Internal Server Error` — `{ "success": false, "message": "Failed to delete todo" }`

---

## Unhandled Errors

Any error not caught by a controller's own `try/catch` falls through to the global error handler, which responds with:

- `500 Internal Server Error` — `{ "success": false, "message": "<error message or 'Internal server error'>" }`

# Week 10 — CP31 SQL Injection Testing

## Environment
- API: http://localhost:3001
- Database: SQLite (campus-test.db)
- Endpoint: GET /api/requests?status=
- Technique: Parameterized Queries

## Test 1: OR Injection

Payload:
' OR '1'='1

Command:
curl -sG "http://localhost:3001/api/requests" \
  --data-urlencode "status=' OR '1'='1"

Actual result:
[]

Status: PASS

## Test 2: DROP TABLE Injection

Payload:
'; DROP TABLE requests; --

Command:
curl -sG "http://localhost:3001/api/requests" \
  --data-urlencode "status='; DROP TABLE requests; --"

Actual result:
[]

Status: PASS

Verification:
GET /api/requests still returned 5 records.

## Test 3: UNION SELECT Injection

Payload:
' UNION SELECT * FROM users --

Command:
curl -sG "http://localhost:3001/api/requests" \
  --data-urlencode "status=' UNION SELECT * FROM users --"

Actual result:
[]

Status: PASS

## Conclusion

All three SQL injection payloads returned an empty array.
The requests table remained accessible after testing.

The application uses parameterized SQL queries:
WHERE r.status = ?

This prevents the supplied status value from being interpreted
as executable SQL in the tested endpoint.

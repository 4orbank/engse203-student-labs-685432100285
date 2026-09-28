# Week 05 — React Routing Data Fetching Mini App

## Overview
Campus Service Request mini application from Week 04, extended with React Router, Service Layer, browser storage, recovery, and CRUD.

## Component structure
App
└── Routes
    └── AppLayout
        ├── AppHeader
        └── Outlet
            ├── DashboardPage
            ├── NewRequestPage
            ├── RequestDetailPage
            ├── AboutPage
            └── NotFoundPage

## Dependency array
Dashboard and detail pages use Effect dependencies for values that should trigger a new load. Cleanup prevents an older asynchronous result from updating a page after navigation.

## Storage
Request data is stored under one LAB-specific localStorage key. Data is wrapped with schemaVersion and updatedAt, and invalid data is recovered from the seed JSON.

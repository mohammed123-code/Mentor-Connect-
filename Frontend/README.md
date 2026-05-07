# Mentor Connect+ Frontend

React + Vite frontend for Mentor Connect+, a mentoring platform for students,
mentors, alumni, and admins.

## Completed Screens

- Landing page with mentor discovery and domain filtering
- Student login and registration
- Student dashboard with recommendations, search, requests, sessions, roadmaps,
  and forum preview
- Mentor dashboard with request management, availability, sessions, and resource
  sharing
- Mentor profile page with expertise, roadmap, feedback, and booking actions
- Session booking page with local confirmation
- Admin dashboard for verification, users, domains, and reports

## Frontend Demo Behavior

This frontend uses mock data and `localStorage` so the UI works without a
backend. Login and registration accept demo input and route users to the correct
dashboard based on role.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run lint
npm run build
```

# PCEA Church System Frontend

Modern React + Tailwind CSS interface for the PCEA Church Management System backend.

##  Tech Stack
- [Vite](https://vitejs.dev/) + React 19
- [Tailwind CSS](https://tailwindcss.com/) with custom theme
- [React Router v6](https://reactrouter.com/)
- [Zustand](https://zustand-demo.pmnd.rs/) for auth state
- [Axios](https://axios-http.com/) with JWT interceptors
- [React Hook Form](https://react-hook-form.com/)
- [React Hot Toast](https://react-hot-toast.com/) for notifications
- [Recharts](https://recharts.org/) for admin dashboards

##  Folder Structure
```
frontend/
├── src/
│   ├── api/              # Axios client
│   ├── components/       # Shared UI, layouts, utilities
│   ├── hooks/            # Custom hooks (auth bootstrap)
│   ├── pages/            # Admin, member, and shared pages
│   ├── routes/           # Route guards and redirects
│   ├── store/            # Zustand auth store
│   ├── utils/            # Formatting helpers & constants
│   ├── App.jsx           # Router configuration
│   └── main.jsx          # Application entrypoint
└── README.md             # This file
```

##  Environment Variables
Create `frontend/.env` (or `.env.local`) with:
```bash
VITE_API_URL=http://localhost:8000/api
```
> Update `VITE_API_URL` if the Django backend is exposed on a different host/port.

## Setup & Scripts
```bash
cd frontend
npm install          # install dependencies
npm run dev          # start development server (http://localhost:5173)
npm run build        # production build
npm run preview      # preview the production build
```

##  Authentication Flow
1. Credentials are submitted to `/api/auth/login/`.
2. Access & refresh tokens are stored in `localStorage` (`pcea_access_token`, `pcea_refresh_token`).
3. Axios interceptors attach `Authorization: Bearer <token>` automatically.
4. On 401 responses the client attempts `/api/auth/token/refresh/`; if it fails the user is signed out.
5. Role-based routing:
   - `admin/pastor/staff` → `/admin/*`
   - `member` → `/member/*`

##  Key API Endpoints Used
| Feature | Endpoint |
|---------|----------|
| Auth | `/auth/login/`, `/auth/register/`, `/auth/profile/`, `/auth/change-password/`
| Members | `/members/`
| Announcements | `/announcements/`, `/announcements/urgent/`
| Hymns | `/hymns/`, `/hymns/search/`, `/hymns/random/`
| Livestreams | `/livestream/`, `/livestream/now/`, `/livestream/upcoming/`
| SMS | `/sms/send/`, `/sms/`
| Finance | `/finance/tithes/`, `/finance/offerings/`, `/finance/reports/summary/`, `/finance/tithes/my-tithes/`
| Events | `/events/`, `/events/{id}/attendance/`, `/events/{id}/mark-attendance/`

##  Navigation Overview
- `/login`, `/register` – authentication screens (public)
- `/admin/*` – admin console (role: admin/pastor/staff)
- `/member/*` – member portal (role: member)
- `/profile` – shared profile management



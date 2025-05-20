# Lead Management System

A Next.js application for managing immigration case assessment leads. The application includes a public lead submission form and an internal admin interface for lead management.

## Features

- Public lead submission form
- Admin dashboard for lead management
- Authentication for admin users
- Lead status management (Pending to Reached Out)
- Mock API implementation
- Responsive design

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS for styling
- Mock API implementation (can be replaced with real backend)

## Getting Started

### Prerequisites

- Node.js 18.17 or later

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd lead-management
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Application Structure

- `/src/app/` - Next.js App Router pages
- `/src/components/` - React components
- `/src/lib/` - Utility functions and API services
- `/src/types/` - TypeScript type definitions
- `/src/contexts/` - React context providers

## Admin Access

To access the admin dashboard, navigate to `/login` and use the following credentials:

- Email: admin@alma.ai
- Password: password

## API Routes

- `GET /api/leads` - Get all leads
- `POST /api/leads` - Create a new lead
- `GET /api/leads/[id]` - Get a specific lead
- `PATCH /api/leads/[id]` - Update a lead's status
- `POST /api/auth` - Login
- `DELETE /api/auth` - Logout

## Development Notes

This project uses mock data and simulated API calls for demonstration purposes. In a production environment, these would be replaced with real API calls to a backend service.

## License

This project is licensed under the MIT License.

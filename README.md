# Lead Management System

A Next.js application for managing immigration case assessment leads. This system provides a public form for potential clients to submit their information for visa assessment and an admin dashboard for managing these leads.

## Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Key Features](#key-features)
- [Technical Stack](#technical-stack)
- [Component Structure](#component-structure)
- [Data Flow](#data-flow)
- [Authentication](#authentication)
- [API Implementation](#api-implementation)
- [Form Submission Flow](#form-submission-flow)
- [Admin Dashboard](#admin-dashboard)
- [Styling Guide](#styling-guide)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [Extending the Application](#extending-the-application)

## Overview

The Lead Management System is designed for immigration law firms or consultants to collect potential client information through a public-facing form. The system allows admins to manage these leads through a secure dashboard, where they can view submission details and update lead statuses.

## System Architecture

The application follows a modern React-based architecture using Next.js 14 with the App Router pattern:

- **Frontend**: Next.js with React and TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Client-side state management**: React contexts and hooks
- **Authentication**: Custom authentication context with session storage
- **API**: RESTful API endpoints implemented as Next.js API routes
- **Data storage**: Currently uses in-memory storage with mock data (can be replaced with a database)

## Key Features

### Public Form
- Multi-section submission form
- Input validation
- Visa category selection
- Responsive design
- Success confirmation

### Admin Dashboard
- Secure login with session management
- Lead listing with filtering and search
- Pagination for large datasets
- Status updates
- Responsive admin interface

## Technical Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe code
- **Tailwind CSS**: Utility-first CSS framework
- **React Context API**: State management
- **Next.js API Routes**: Backend API implementation

## Component Structure

### Core Components

- **LeadForm.tsx**: Public-facing form for lead submission
- **ThankYou.tsx**: Success confirmation after form submission
- **AdminLayout.tsx**: Layout wrapper for admin pages
- **LeadTable.tsx**: Table component for displaying leads
- **UI Components**: Button, Input, Select

### Pages

- **app/page.tsx**: Public homepage with submission form
- **app/admin/page.tsx**: Admin dashboard
- **app/login/page.tsx**: Admin login page

### Contexts

- **AuthContext.tsx**: Authentication state management

## Data Flow

1. **Form Submission**:
   - User fills out the public form
   - Client-side validation ensures data integrity
   - Form data is submitted to the API
   - User is shown a thank you page

2. **Admin Operations**:
   - Admin logs in via the login page
   - AuthContext establishes and maintains the session
   - Admin views the lead dashboard
   - Admin can search, filter, and update lead statuses
   - Changes are persisted via API calls

## Authentication

The system implements a simple authentication flow:

1. Admin enters credentials on the login page
2. Credentials are verified against mocked user data
3. On successful login, user data is stored in AuthContext and localStorage
4. Protected admin routes check AuthContext for authentication
5. Unauthenticated users are redirected to the login page

Login credentials:
- Email: admin@tryalma.ai
- Password: password

## API Implementation

The application uses Next.js API routes and mock data. In a production environment, these would connect to a real database.

### API Endpoints

- `GET /api/leads`: Retrieve all leads
- `POST /api/leads`: Create a new lead
- `PATCH /api/leads/:id`: Update a lead status
- `POST /api/auth/login`: Authenticate user
- `POST /api/auth/logout`: End user session

## Form Submission Flow

1. User navigates to the public form
2. User fills out personal information:
   - First and last name
   - Email
   - Country of citizenship
   - LinkedIn profile
3. User selects visa categories of interest (O-1, EB-1A, EB-2 NIW, etc.)
4. User provides additional information about their case
5. User submits the form
6. System validates all required fields
7. On successful validation, form data is sent to the API
8. User is shown a thank you page with confirmation

## Admin Dashboard

The admin dashboard provides a comprehensive view of all submitted leads:

### Features

- **Lead Table**: Display leads with filterable columns
- **Search**: Search leads by name, email, or country
- **Status Filtering**: Filter leads by their current status
- **Pagination**: Navigate through multiple pages of leads
- **Status Update**: Change lead status from "Pending" to "Reached Out"

### Navigation

- **Sidebar**: Access different sections of the admin interface
- **User Profile**: Display current admin user

## Styling Guide

The application follows a consistent design language:

- **Color Scheme**:
  - Primary colors: Black, white, and cream (#f9f9e1)
  - Accent colors: Indigo for form sections
  - Status colors: Yellow for pending, green for reached out

- **Typography**:
  - Sans-serif fonts throughout
  - Clear hierarchy with different font weights and sizes
  - Black text for high contrast and readability

- **Components**:
  - Consistent input styling with proper focus states
  - Rounded corners for containers and inputs
  - Proper spacing between elements
  - Responsive design that works on mobile and desktop

## Setup and Installation

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation Steps

1. Clone the repository:

```bash
git clone [repository-url]
cd lead-management
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Setup environment variables (if needed):

Create a `.env.local` file in the root directory:

```
# Example environment variables
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

The application will be available at http://localhost:3000

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Extending the Application

### Adding a Real Database

Replace the mock data implementation in `/src/lib/api.ts` with actual database calls:

1. Install a database library (e.g., Prisma, MongoDB client)
2. Create database models matching the existing types
3. Replace mock API functions with real database queries
4. Update API routes to use the new database functions

### Enhancing Authentication

To implement more robust authentication:

1. Integrate with Auth.js (formerly NextAuth.js)
2. Configure providers (credentials, OAuth, etc.)
3. Update the AuthContext to use the new authentication flow
4. Add role-based permissions if needed

### Adding New Features

- **Email Notifications**: Send automated emails when leads are submitted
- **Lead Notes**: Allow admins to add notes to leads
- **Analytics Dashboard**: Add charts and metrics for lead data
- **Export Functionality**: Allow exporting leads to CSV or Excel
- **Multi-language Support**: Add internationalization for global use

## License

This project is licensed under the MIT License.

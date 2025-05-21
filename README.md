# Real Estate Management System

A comprehensive real estate management system built with React, Redux, and modern web technologies.

## Project Structure

```
src/
├── modules/                    # Feature-based modules
│   ├── admin/                 # Admin module
│   │   ├── pages/            # Admin pages
│   │   ├── components/       # Admin-specific components
│   │   ├── services/         # Admin API services
│   │   └── utils/            # Admin utilities
│   ├── executive/            # Executive module
│   │   ├── pages/           # Executive pages
│   │   ├── components/      # Executive-specific components
│   │   ├── services/        # Executive API services
│   │   └── utils/           # Executive utilities
│   ├── sales/               # Sales module
│   │   ├── pages/          # Sales pages
│   │   ├── components/     # Sales-specific components
│   │   ├── services/       # Sales API services
│   │   └── utils/          # Sales utilities
│   └── client/             # Client module
│       ├── pages/          # Client pages
│       ├── components/     # Client-specific components
│       ├── services/       # Client API services
│       └── utils/          # Client utilities
├── store/                  # Redux store
│   ├── slices/            # Redux slices
│   └── index.js           # Store configuration
├── components/            # Shared components
│   ├── common/           # Common UI components
│   └── layout/           # Layout components
├── utils/                # Utility functions
├── services/             # API services
└── hooks/               # Custom React hooks
```

## Features

### Admin Module
- Authentication with JWT
- Dashboard with analytics
- Reports generation
- User management
- Role-based permissions
- 2FA and audit logs

### Executive Module
- Lead management
- Customer management
- Site visits scheduling
- Document management
- Google Calendar integration

### Sales Module
- Inventory management
- Booking management
- Payment tracking
- Handover process
- Referral system

### Client Module
- Client dashboard
- Document access
- Payment tracking
- Referral submission

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Technology Stack

- React
- Redux Toolkit
- React Router
- Tailwind CSS
- Axios
- JWT Authentication
- React Query (for data fetching)
- React Hook Form (for forms)
- React Toastify (for notifications)

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License.

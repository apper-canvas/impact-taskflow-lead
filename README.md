# TaskFlow - Project Management System

A modern, professional project management application built with React and Vite. TaskFlow helps you organize multiple projects and tasks with visual clarity and effortless navigation.

## Features

- **Project Management**: Create and manage multiple projects with color coding
- **Task Organization**: Full CRUD operations for tasks with status workflow
- **Visual Progress Tracking**: Real-time progress indicators and statistics
- **Smart Filtering**: Filter tasks by status and priority
- **Responsive Design**: Works perfectly on all devices
- **Local Storage**: All data persists automatically

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Technology Stack

- React 18 + Vite
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Lucide React for icons
- date-fns for date formatting

## Project Structure

```
src/
├── components/
│   ├── atoms/          # Basic UI components
│   ├── molecules/      # Composite components
│   ├── organisms/      # Complex components
│   ├── pages/          # Page components
│   └── ui/             # State components
├── services/
│   ├── api/            # Service layer
│   └── mockData/       # JSON data
└── utils/              # Utility functions
```

## License

MIT
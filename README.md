# Google Sheets Clone

## Description
This project is a Google Sheets clone built with Next.js. It aims to replicate the core functionalities of Google Sheets, providing users with a familiar interface for spreadsheet management.

## Installation

To get started with the project, clone the repository and install the dependencies:

```bash
git clone https://github.com/abhijeets54/google-sheets-clone.git
cd google-sheets-clone
npm install
```

## Usage

To run the development server, use the following command:

```bash
npm run dev
```

To build the project for production, use:

```bash
npm run build
```

To start the production server, use:

```bash
npm run start
```

## Features

- Rich UI components using Radix UI
- Form handling with React Hook Form
- Styling with Tailwind CSS
- Static site generation with Next.js

## File Structure Overview

```
.
├── app/                     # Main application files
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Main layout component
│   └── page.tsx             # Main page component
├── components/              # Reusable components
│   ├── Cell.tsx             # Cell component
│   ├── FormulaBar.tsx       # Formula bar component
│   ├── Header.tsx           # Header component
│   ├── Sheet.tsx            # Sheet component
│   └── Toolbar.tsx          # Toolbar component
├── hooks/                   # Custom hooks
│   ├── use-local-storage.ts  # Hook for local storage
│   └── use-toast.ts         # Hook for toast notifications
├── lib/                     # Utility functions
│   ├── sheet-utils.ts       # Utilities for sheet operations
│   └── utils.ts             # General utility functions
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies and scripts
└── README.md                # Project documentation
```

## Next.js Configuration

The project is configured with the following settings:

- **Output**: Set to 'export' for static site generation.
- **ESLint**: Errors are ignored during builds.
- **Images**: Unoptimized images for development.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

# JustTenH Vendor Portal

## Overview
The JustTenH Vendor Portal is a React-based frontend application that enables vendors to manage their online stores on the JustTenH ecommerce platform. Built with React, TypeScript, and Vite, this portal provides vendors with powerful tools to list products, process orders, and customize their storefronts.

### Features
- Comprehensive vendor dashboard
- Product management (add, edit, delete)
- Order processing and fulfillment
- Inventory management
- Sales analytics and reporting
- Store customization options
- Real-time notifications

## Project Status
This project is currently a work in progress with the following features under development:
- Enhanced product management
- Advanced analytics dashboard
- Template customization tools
- Marketing tools integration
- Bulk import/export functionality
- And more...

## Installation and Setup

### Prerequisites
- Node.js >= 14.0.0
- npm or yarn
- Connection to JustTenH backend API

### Installation Steps
1. Clone the repository
   ```
   git clone https://github.com/SochesdaThoeun/justtenh-sys
   cd jt-vendor
   ```

2. Install dependencies
   ```
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   ```

4. Configure your API settings in the `.env` file
   ```
   VITE_API_URL=https://justtenh.com/api
   ```

   Note: The base API URL is defined in `src/app/constants/api.constants.ts` and is set to `https://justtenh.com`

5. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

## Building for Production
```
npm run build
# or
yarn build
```

## Repository Information
- GitHub: [https://github.com/SochesdaThoeun/justtenh-sys](https://github.com/SochesdaThoeun/justtenh-sys)
- Repository: jt-vendor

## License
This project is proprietary software. All rights reserved. 
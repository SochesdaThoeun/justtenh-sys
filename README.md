# JustTenH System

FOR FULL VERSION: https://justtenh.com/


## System Overview
JustTenH is a comprehensive multi-component ecommerce platform that consists of:

1. **Vendor Portal** - A React-based frontend application that enables vendors to manage their online stores
2. **User Backend** - A Laravel-based backend for the core ecommerce platform functionality

## Components

### Vendor Portal (jt-vendor)
The vendor portal provides a dashboard for store owners to:
- Manage products (add, edit, delete)
- Process orders and fulfillment
- Track inventory
- View sales analytics
- Customize storefronts
- Receive real-time notifications

### User Backend (jt-user-backend)
The backend system powers the ecommerce platform with:
- Multi-vendor marketplace functionality
- User purchasing interface
- Secure payment processing
- Store template customization
- Admin management tools

## Installation and Setup

### Prerequisites
- Node.js >= 14.0.0
- PHP >= 7.3
- Composer
- MySQL
- npm or yarn

### Setting Up the Vendor Portal
1. Navigate to the vendor portal directory
   ```
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

4. Configure API settings in the `.env` file
   ```
   VITE_API_URL=https://justtenh.com/api
   ```

5. Start the development server
   ```
   npm run dev
   # or
   yarn dev
   ```

### Setting Up the User Backend
1. Navigate to the backend directory
   ```
   cd jt-user-backend
   ```

2. Install PHP dependencies
   ```
   composer install
   ```

3. Set up environment variables
   ```
   cp .env.example .env
   php artisan key:generate
   ```

4. Configure database settings in the `.env` file
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=justtenh
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. Database Setup (Recommended method)
   ```
   # Create a database named 'justtenh'
   mysql -u your_username -p justtenh < justtenh.sql
   ```
   
   Alternatively, you can use migrations:
   ```
   php artisan migrate
   ```

6. Configure vendor API details in `app/Enums/GlobalConstant.php` as needed

7. Start the development server
   ```
   php artisan serve
   ```

## Building for Production

### Vendor Portal
```
cd jt-vendor
npm run build
# or
yarn build
```

### User Backend
Follow standard Laravel deployment procedures for production environments.

## Repository Information
- GitHub: [https://github.com/SochesdaThoeun/justtenh-sys](https://github.com/SochesdaThoeun/justtenh-sys)

## License
This project is proprietary software. All rights reserved. 

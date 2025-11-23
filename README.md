# Blog RESTful API

A production-ready RESTful API for a blog platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control (Super Admin, Admin, User)
- 📝 **Blog Management**: Create, read, update, and delete posts
- 📁 **Category Management**: Organize posts by categories
- 📤 **File Upload**: AWS S3 integration for image uploads
- 🔒 **Security**: Rate limiting, input validation, password hashing, CORS protection
- ✅ **Email Verification**: Email verification system with code expiration
- 🔄 **Password Recovery**: Secure password reset functionality

## Prerequisites

- Node.js (v14 or higher)
- MongoDB database
- AWS S3 account (for file uploads)
- Email service credentials (Gmail SMTP)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd blog-restful-API
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
CON_URL=mongodb://localhost:27017/blog-api
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
AWS_ACCESS_KEY=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=us-east-1
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
JWT_EXPIRES_IN=3d
```

4. Seed the database with sample data:

```bash
npm run seed
```

## Database Seeding

The seed script will create:

- **6 Users**:

  - 1 Super Admin (role: 1)
  - 1 Admin (role: 2)
  - 4 Regular Users (role: 3)

- **10 Categories**:

  - Technology, Programming, Web Development, Mobile Development, DevOps, Data Science, Cybersecurity, Career & Learning, Productivity, Open Source

- **20 Blog Posts** covering various topics

- **4 File Entries** for testing file uploads

### Default Login Credentials

After seeding, you can use these credentials to test:

- **Super Admin**: `superadmin@blog.com` / `SuperAdmin@123`
- **Admin**: `admin@blog.com` / `Admin@12345`
- **User**: `john.doe@example.com` / `User@12345`
- **User**: `sarah.johnson@example.com` / `Sarah@123`
- **User**: `michael.chen@example.com` / `Michael@123`

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /signup` - Register a new user
- `POST /login` - User login
- `POST /sent-verification` - Send verification code
- `POST /verify-user` - Verify user email
- `POST /forgot-password-code` - Request password reset code
- `POST /recover-password` - Reset password with code
- `PUT /change-password` - Change password (authenticated)
- `PUT /update-profile` - Update user profile (authenticated)
- `GET /current-user` - Get current user info (authenticated)

### Categories (`/api/v1/category`)

- `POST /` - Create category (Admin only)
- `GET /` - Get all categories (authenticated)
- `GET /:id` - Get category by ID (authenticated)
- `PUT /:id` - Update category (Admin only)
- `DELETE /:id` - Delete category (Admin only)

### Posts (`/api/v1/post`)

- `POST /` - Create post (authenticated)
- `GET /` - Get all posts with pagination (authenticated)
- `GET /:id` - Get post by ID (authenticated)
- `PUT /:id` - Update post (authenticated)
- `DELETE /:id` - Delete post (authenticated)

### Files (`/api/v1/file`)

- `POST /upload` - Upload file to S3 (authenticated)
- `GET /signed-url?key=...` - Get signed URL for file (authenticated)
- `DELETE /delete?key=...` - Delete file (authenticated)

## Security Features

- ✅ Environment variable validation
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting (general: 100 req/15min, auth: 5 req/15min)
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Input validation and sanitization
- ✅ MongoDB injection prevention
- ✅ File upload validation
- ✅ Verification code expiration
- ✅ Password strength requirements

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

## Project Structure

```
blog-restful-API/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── init/           # Database initialization and seeding
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
├── validator/      # Input validation
└── index.js        # Application entry point
```

## License

MIT

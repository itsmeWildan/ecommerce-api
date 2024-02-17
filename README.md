# E-Commerce API Documentation

## Introduction
This is an API for an e-commerce platform built using Node.js, Express, MongoDB, Express JWT, and Bcrypt.js. It provides various endpoints for managing users, products, categories, orders, and more.

## Getting Started
To get started with this API, follow these steps:

1. Clone the repository:
```
git clone <repository-url>
```

## Install dependencies:
```
npm install
```

## Set up your environment variables by creating a .env file and adding the following variables:
```
PORT=3000
API_URL=/api/v1
CONNECTION_STRING=<your-mongodb-connection-string>
SECRET=<your-secret-key>
```

## Run the server:
```
npm start
```

# Routes

## Users

### Register User
- **POST** `/api/v1/users/register`
  - Register a new user.
  - **Request Body:**
    - `name`: String (required)
    - `email`: String (required)
    - `password`: String (required)
    - `phone`: String (required)
    - `isAdmin`: Boolean (optional)

### Login User
- **POST** `/api/v1/users/login`
  - Log in an existing user.
  - **Request Body:**
    - `email`: String (required)
    - `password`: String (required)
  - **Response:**
    - `token`: JWT token for authentication

### Get All Users
- **GET** `/api/v1/users`
  - Retrieve all users.

### Get User by ID
- **GET** `/api/v1/users/:id`
  - Retrieve a user by their ID.

### Update User
- **PUT** `/api/v1/users/:id`
  - Update an existing user.
  - **Request Body (fields to update):**
    - `name`: String
    - `email`: String
    - `password`: String
    - `phone`: String
    - `isAdmin`: Boolean
    - `street`: String
    - `apartment`: String
    - `zip`: String
    - `city`: String
    - `country`: String

### Delete User
- **DELETE** `/api/v1/users/:id`
  - Delete a user by their ID.

### Get Users Count
- **GET** `/api/v1/users/get/count`
  - Get the total count of users.

## Products

### Create Product
- **POST** `/api/v1/products`
  - Create a new product.
  - **Request Body:**
    - `name`: String (required)
    - `description`: String (required)
    - `richDescription`: String
    - `image`: String (URL)
    - `images`: Array of Strings (URLs)
    - `brand`: String
    - `price`: Number (required)
    - `category`: String (Category ID)
    - `countInStock`: Number (required)
    - `rating`: Number
    - `numReviews`: Number
    - `isFeatured`: Boolean

### Get All Products
- **GET** `/api/v1/products`
  - Retrieve all products.

### Get Product by ID
- **GET** `/api/v1/products/:id`
  - Retrieve a product by its ID.

### Update Product
- **PUT** `/api/v1/products/:id`
  - Update an existing product.
  - **Request Body (fields to update):**
    - Same as create product request body

### Delete Product
- **DELETE** `/api/v1/products/:id`
  - Delete a product by its ID.

### Get Products Count
- **GET** `/api/v1/products/get/count`
  - Get the total count of products.

### Get Featured Products
- **GET** `/api/v1/products/get/featured/:count`
  - Get a specified number of featured products.

### Upload Gallery Images for Product
- **PUT** `/api/v1/products/gallery-images/:id`
  - Upload additional images for a product.
  - **Request Body:**
    - `images`: Array of Strings (URLs)

## Orders

### Get All Orders
- **GET** `/api/v1/orders`
  - Retrieve all orders.

### Get Order by ID
- **GET** `/api/v1/orders/:id`
  - Retrieve an order by its ID.

### Create Order
- **POST** `/api/v1/orders`
  - Create a new order.
  - **Request Body:**
    - `orderItems`: Array of Objects
      - `quantity`: Number (required)
      - `product`: String (Product ID, required)
    - `shippingAddress1`: String (required)
    - `shippingAddress2`: String
    - `city`: String (required)
    - `zip`: String (required)

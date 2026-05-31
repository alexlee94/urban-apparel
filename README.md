# Urban Apparel 🛍️

A full-stack e-commerce platform for clothing, built with Java Spring Boot and React TypeScript.

## Tech Stack

**Backend:** Java, Spring Boot, Spring Security, JWT  
**Frontend:** React, TypeScript, Material UI  
**Database:** MySQL  
**Cloud:** Cloudinary (image storage)  
**Tools:** Docker, Maven, Git

## Features

- **JWT Authentication** — Secure login and registration with role-based access control (USER/ADMIN). Access control enforced at the API layer, not the frontend, so admin endpoints cannot be reached regardless of how the request is made.
- **Product Catalog** — Browse products with images, filter by category, and view product details.
- **Shopping Cart** — Add, update, and remove items from cart.
- **Pessimistic Locking** — Concurrent cart and inventory updates are wrapped in a single transaction with pessimistic locking, preventing inventory from being decremented below zero.
- **Checkout & Orders** — Full checkout flow with order history and status tracking.
- **Admin Panel** — Admins can create products, upload images, and manage order statuses.
- **Cloudinary Integration** — Product images uploaded and served via Cloudinary.

## Screenshots

> Add screenshots here after deployment

## Running Locally

### Prerequisites
- Java 17
- Maven
- Docker
- Node.js 18+

### Backend

1. Start MySQL with Docker:
```bash
docker run --name urban-apparel-db \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=urban_apparel \
  -p 3306:3306 -d mysql:8
```

2. Configure `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/urban_apparel
spring.datasource.username=root
spring.datasource.password=password
cloudinary.cloud-name=your_cloud_name
cloudinary.api-key=your_api_key
cloudinary.api-secret=your_api_secret
app.jwt.secret=your_jwt_secret
```

3. Run the Spring Boot app:
```bash
./mvnw spring-boot:run
```

### Frontend

```bash
cd urban-apparel-frontend
npm install
npm start
```

App runs at `http://localhost:3000`  
API runs at `http://localhost:8080`

## API Endpoints

### Auth
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/refresh` | Public |
| POST | `/api/auth/logout` | Authenticated |

### Products
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/products` | Public |
| GET | `/api/products/{id}` | Public |
| POST | `/api/products` | Admin |
| PUT | `/api/products/{id}` | Admin |
| DELETE | `/api/products/{id}` | Admin |
| POST | `/api/products/{id}/image` | Admin |

### Cart
| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/api/cart` | Authenticated |
| POST | `/api/cart` | Authenticated |
| PUT | `/api/cart/{itemId}` | Authenticated |
| DELETE | `/api/cart/{itemId}` | Authenticated |

### Orders
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | `/api/orders/checkout` | Authenticated |
| GET | `/api/orders` | Authenticated |
| GET | `/api/orders/{id}` | Authenticated |
| GET | `/api/orders/all` | Admin |
| PUT | `/api/orders/{id}/status` | Admin |

## Default Admin Account

```
Email: admin@gmail.com
Password: admin123
```
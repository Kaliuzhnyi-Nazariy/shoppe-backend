# shoppe-backend

Backend API for ecommerce application.

## Technologies

- node.js
- TypeScript
- Express.js
- Cloudinary
- Jest
- PDFKit
- Prisma ORM

---

## Features

- Authentication & authorization
- Product management
- Cart system
- Orders
- Address management
- Password reset
- File uploads
- PDF invoice generation

## Getting started

### Prerequirements

[Node.js](https://nodejs.org/en)

### Cloning

```bash
git clone https://github.com/Kaliuzhnyi-Nazariy/shoppe-backend.git
cd shoppe-backend
```

### Config .env

```bash
JWT_SECRET=
JWT_SECRET_FOR_RESET_PASSWORD=

# send email
API_KEY_MAIL=
SECRET_KEY_MAIL=

# db
DATABASE_URL=

DIRECT_URL=

# Cloudinary
CLOUD_NAME=
CLOUD_API_KEY=
CLOUD_API_SECRET=
```

### Starting

#### Development

```bash
npm install 
npm run dev
```

#### Production

```bash
npm install
npm run build
npx prisma migrate deploy
npm run start
```

#### Testing

Unit and integration tests are implemented with Jest and Supertest.

```bash
npm run test
```

## API Endpoints

## Authentication

Protected routes require Bearer token authentication.

Example:

```http
Authorization: Bearer <token>
```

### GET /api/address/:addressId

#### RESPONSE

```json
    {
    "id": "id",
    "firstName": "first name",
    "lastName": "last name",
    "email": "example@mail.com",
    "created_at": "2026-01-05T21:04:39.644Z",    "userId": "user_id",
    "companyName": null,
    "country": "country",
    "streetAddress": "address",
    "postcode": "postcode",
    "city": "city",
    "phone": "phone"
    }
```

### POST /api/auth/signup

#### REQUEST

```json
{
  "firstName": "first_name", 
  "lastName": "last_name", 
  "displayName": "display_name", 
  "email": "example@mail.com", 
  "password": "hashed_password",
  "confirmPassword": "hashed_password"  
}
```

#### RESPONSE

```json 
{
    "token": "token"
}
```

### GET /api/cart

#### RESPONSE

```json 
{
    "id": "id",
    "items": [
        {
            "id": "product-id",
            "quantity": "quantity user add",
            "userId": "user-id",
            "price": "product-price",
            "product": {
                "id": "product-id",
                "title": "product-title",
                "description": "product-description",
                "photos": [
                    {
                        "id": "product-photo-id",
                        "link": "product-photo-link",
                        "productId": "product-id"
                    },
                ],
                "rate": "rate",
                "reviewCount": "reviewCount",
                "amount": "product-amount",
                "isArchived": false
            }
        }
    ]
}
```

### GET /api/downloads

#### RESPONSE

```json 
[    
    {
        "id": "download-id",
        "orderId": "order-id",
        "userId": "user-id",
        "totalPrice": "price of order",
        "createdAt": "2026-05-05T21:25:16.821Z"
    }
]
```

### GET /api/orders/:orderId

#### RESPONSE

```json 
{
    "id": "id",
    "createdAt": "2026-04-29T14:05:23.397Z",
    "updatedAt": "2026-04-30T09:06:58.286Z",
    "buyerId": "user-id",
    "billingFirstName": "name",
    "billingLastName": "surname",
    "billingCompanyName": null,
    "billingStreet": "address",
    "billingCity": "city",
    "billingPostcode": "00000",
    "billingCountry": "country",
    "billingPhone": "+1234567890",
    "billingEmail": "example@email.com",
    "shippingFirstName": "name",
    "shippingLastName": "surname",
    "shippingCompanyName": null,
    "shippingStreet": "address",
    "shippingCity": "city",
    "shippingPostcode": "00000",
    "shippingCountry": "country",
    "shippingPhone": "+1234567890",
    "shippingEmail": "example@email.com",
    "buyerEmail": "example@email.com",
    "contactNumber": "+1234567890",
    "deliveryOption": "free",
    "status": "canceled",
    "paymentMethod": "cashOnDelivery",
    "totalPrice": 4000,
    "notes": null,
    "items": [],
    "payment": {
        "id": "payment-id",
        "orderId": "order-id",
        "method": "cashOnDelivery",
        "status": "pending",
        "amount": 4000,
        "providerId": null,
        "createdAt": "2026-04-29T14:05:23.397Z"
    }
}
```

### POST /api/product/create

#### REQUEST

```form data 
{
    "title": "product-title",
    "description": "product-description",
    "price": "100",
    "additionalInformation": "",
    "product_photo": File,
    "amount": "50",
}
```

#### RESPONSE

```json 
{    
    "id": "product-id",
    "createdAt": "2026-04-29T14:05:23.397Z",
    "amount": 50,
    "additionalInformation": "",
    "isArchived": false,
    "rate": 0,
    "title": "product title",
    "description": "",
    "price": 0,
    "updatedAt": "2026-04-29T14:05:23.397Z",
    "reviewCount": 0
}
```

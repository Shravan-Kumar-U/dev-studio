# 3D Models E-Commerce Platform

A production-ready e-commerce platform built for a startup to showcase and sell high-quality 3D models and 3D-printed products.

The platform provides customers with a smooth shopping experience while giving administrators a powerful dashboard to manage products, orders, customers, and other business operations.

## 🚀 Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- Socket.IO
- JWT Authentication
- REST APIs

### Database
- MongoDB
- Mongoose

## ✨ Key Features

### Customer
- Browse 3D models and products
- Product search and filtering
- Product details with multiple images
- Add to cart
- Wishlist
- Secure checkout
- Order placement and tracking
- User authentication
- Responsive design
- Real-time order/status updates

### Admin
- Secure admin authentication
- Dashboard with business statistics
- Add, edit, and delete products
- Upload multiple product images
- Manage orders
- Manage customers
- Monitor product inventory
- View sales information
- Real-time dashboard updates

## ⚡ Real-Time Communication

The application uses **Socket.IO** for real-time communication.

It can be used for:
- Real-time order status updates
- Inventory updates
- Admin dashboard updates
- Customer notifications
- Other real-time events

## 📁 Project Structure

```text
3d-models/
├── client/                 # React + Tailwind frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── hooks/
│   │   └── utils/
│   └── package.json
│
├── server/                 # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── sockets/
│   └── server.js
│
├── .env
├── .gitignore
└── README.md
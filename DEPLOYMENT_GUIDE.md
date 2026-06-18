# Pizza Palace - Full Stack Deployment Guide

## Project Structure

```
/
├── backend/          # Node.js Express API
│   ├── config/       # Database configuration
│   ├── controllers/  # Business logic
│   ├── middleware/   # Authentication & error handling
│   ├── models/       # MongoDB schemas
│   ├── routes/       # API endpoints
│   ├── .env          # Environment variables (local)
│   ├── server.js     # Entry point
│   └── vercel.json   # Vercel configuration
├── frontend/         # React + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # State management
│   │   ├── services/      # API client
│   │   ├── pages/         # Route pages
│   │   └── App.jsx        # Root component
│   ├── .env          # Local development env
│   ├── .env.production  # Production env
│   └── vercel.json   # Vercel configuration
```

---

## 🚀 Local Development Setup

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB**
   - Get MongoDB connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Add your current IP to IP Whitelist in MongoDB Atlas
   - Update `.env` file with your connection string:
     ```
     MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/pizza-palace?retryWrites=true&w=majority
     PORT=4000
     JWT_SECRET=your_super_secret_jwt_key_change_in_production
     NODE_ENV=development
     FRONTEND_URL=http://localhost:5173
     ```

4. **Start the backend server**
   ```bash
   npm run server
   ```
   Backend will run on: `http://localhost:4000`

### Frontend Setup

1. **Navigate to frontend directory** (in new terminal)
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on: `http://localhost:5173`

4. **Verify API connection**
   - Open browser console to check for any CORS errors
   - Verify `.env` has correct backend URL

---

## 🌐 Vercel Deployment

### Prerequisites
- GitHub account with repository
- Vercel account (https://vercel.com)
- MongoDB Atlas account with IP whitelist configured for Vercel

### Backend Deployment to Vercel

1. **Add Vercel CLI** (optional, for local deployment)
   ```bash
   npm i -g vercel
   ```

2. **Prepare backend**
   - Ensure `vercel.json` exists in backend root
   - All dependencies in `package.json`

3. **Deploy on Vercel Dashboard**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select backend folder as root directory
   - Add Environment Variables:
     ```
     MONGODB_URI = your_mongodb_atlas_connection_string
     JWT_SECRET = your_secure_jwt_secret
     NODE_ENV = production
     FRONTEND_URL = https://your-frontend-domain.vercel.app
     ```
   - Click Deploy

4. **After deployment**
   - Get your backend URL (e.g., `https://pizza-backend.vercel.app`)
   - Note this for frontend configuration

### Frontend Deployment to Vercel

1. **Update environment variables**
   - Update `frontend/.env.production`:
     ```
     VITE_API_URL=https://pizza-backend.vercel.app/api
     ```

2. **Deploy on Vercel Dashboard**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select frontend folder as root directory
   - Add Environment Variables:
     ```
     VITE_API_URL = https://your-backend-domain.vercel.app/api
     ```
   - Click Deploy

3. **Verify deployment**
   - Frontend will be available at Vercel URL
   - Check browser console for any errors
   - Test API calls by accessing user authentication or placing an order

---

## 🔧 Environment Variables

### Backend (.env and Vercel)

| Variable | Local | Production | Notes |
|----------|-------|------------|-------|
| `MONGODB_URI` | mongodb://localhost:27017/pizza-palace | MongoDB Atlas URL | Must whitelist Vercel IPs |
| `PORT` | 4000 | 3000 (Vercel default) | Vercel assigns automatically |
| `JWT_SECRET` | your_super_secret_jwt_key_change_in_production | Strong random key | Change for production |
| `NODE_ENV` | development | production | Controls error verbosity |
| `FRONTEND_URL` | http://localhost:5173 | https://your-frontend.vercel.app | For CORS configuration |

### Frontend (.env and .env.production)

| Variable | Local | Production | Notes |
|----------|-------|------------|-------|
| `VITE_API_URL` | http://localhost:4000/api | https://your-backend.vercel.app/api | API endpoint URL |

---

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Pizzas
- `GET /api/pizzas` - Get all pizzas
- `GET /api/pizzas?category=Salad` - Filter by category
- `GET /api/pizzas/:id` - Get single pizza
- `POST /api/pizzas` - Create pizza (admin)
- `PUT /api/pizzas/:id` - Update pizza (admin)
- `DELETE /api/pizzas/:id` - Delete pizza (admin)
- `PATCH /api/pizzas/:id/availability` - Toggle availability (admin)

### Orders
- `POST /api/orders` - Place order (protected)
- `GET /api/orders/my` - Get my orders (protected)
- `DELETE /api/orders/:id` - Cancel order (protected)
- `GET /api/orders/admin/orders` - Get all orders (admin)
- `PUT /api/orders/:id/status` - Update order status (admin)
- `GET /api/orders/admin/stats` - Get order statistics (admin)

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics (admin)
- `GET /api/admin/users` - List all users (admin)
- `PUT /api/admin/users/:id/role` - Change user role (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)
- `GET /api/admin/orders/recent` - Recent orders (admin)
- `GET /api/admin/orders/search` - Search orders (admin)
- `GET /api/admin/pizzas/analytics` - Pizza analytics (admin)
- `GET /api/admin/revenue/report` - Revenue report (admin)

---

## ✅ Testing Checklist

### Local Testing
- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] Frontend starts without errors
- [ ] Can view food list on home page
- [ ] Can add/remove items from cart
- [ ] Cart persists (localStorage)
- [ ] Can navigate between pages
- [ ] Can open login/signup popup
- [ ] Search for Network errors in console

### Production Testing (Vercel)
- [ ] Backend deployed and health check endpoint works
- [ ] Frontend deployed without build errors
- [ ] Frontend can communicate with backend
- [ ] Authentication flow works (register/login)
- [ ] Can add items to cart and checkout
- [ ] Order submission successful
- [ ] No CORS errors in console
- [ ] Page loads within 3 seconds

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
**Problem:** "Could not connect to any servers in your MongoDB Atlas cluster"
**Solution:**
1. Go to MongoDB Atlas → Network Access
2. Add your IP address (or 0.0.0.0/0 for development)
3. Wait 5-10 minutes for changes to apply

### CORS Error
**Problem:** "Access to XMLHttpRequest blocked by CORS policy"
**Solution:**
- Update `FRONTEND_URL` in backend `.env`
- Ensure CORS middleware in `server.js` includes correct origins
- Restart backend server

### API URL Not Found
**Problem:** "404 Not Found" for API calls
**Solution:**
- Check `VITE_API_URL` in frontend `.env.production`
- Verify backend is deployed and running
- Test API endpoint directly in browser

### Token Expired
**Problem:** "401 Unauthorized" after some time
**Solution:**
- Update JWT_SECRET in backend
- Clear localStorage on client: `localStorage.clear()`
- Re-login to get new token

---

## 🔒 Security Checklist

- [ ] Change JWT_SECRET to strong random value in production
- [ ] MongoDB IP whitelist configured properly
- [ ] Environment variables not committed to git
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS used for production URLs
- [ ] Rate limiting implemented (future)
- [ ] Input validation on backend (implemented)
- [ ] Password hashing with bcrypt (implemented)

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **Vite:** https://vitejs.dev/

---

## 🎯 Next Steps

1. Deploy backend to Vercel
2. Deploy frontend to Vercel
3. Update `.env.production` in frontend with backend URL
4. Test all features in production
5. Monitor error logs in Vercel dashboard
6. Scale as needed

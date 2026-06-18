# 🍕 Pizza Palace - Quick Reference Guide

## 🚀 Quick Start (Local Development)

### Option 1: One-Click Start (Windows)
```powershell
# From project root
.\start-dev.bat
```

### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run server

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000/api
- **API Health Check**: http://localhost:4000

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] MongoDB Atlas connection string ready
- [ ] MongoDB IP whitelist configured (add Vercel IPs)
- [ ] GitHub repository created and pushed
- [ ] Vercel account created

### Backend Deployment
1. Go to https://vercel.com/new
2. Import GitHub repo → select backend folder
3. Add environment variables:
   - `MONGODB_URI` = your MongoDB connection string
   - `JWT_SECRET` = strong random key
   - `NODE_ENV` = production
   - `FRONTEND_URL` = your frontend Vercel URL
4. Click Deploy
5. Copy backend URL

### Frontend Deployment
1. Update `frontend/.env.production`:
   ```
   VITE_API_URL=https://your-backend-url/api
   ```
2. Go to https://vercel.com/new
3. Import GitHub repo → select frontend folder
4. Add environment variable:
   - `VITE_API_URL` = your backend API URL
5. Click Deploy
6. Test everything works

---

## 🔑 Environment Variables Reference

### Backend (Vercel Secrets)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=super_secret_key_here
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel Env)
```
VITE_API_URL=https://your-backend.vercel.app/api
```

---

## 🧪 Testing Your Deployment

### Quick Tests
1. **Health Check**
   ```bash
   curl https://your-backend.vercel.app/
   ```
   Expected: JSON with "success": true

2. **Authentication**
   - Go to frontend URL
   - Click "Sign In"
   - Register new account
   - Check localStorage for token

3. **Cart & Orders**
   - Add items to cart
   - Navigate to checkout
   - Submit order
   - Check browser console for errors

4. **Console Check**
   - Open DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

---

## 🐛 Common Issues & Quick Fixes

| Issue | Solution |
|-------|----------|
| CORS Error | Check FRONTEND_URL in backend env vars |
| MongoDB Connection Failed | Add Vercel IPs to MongoDB whitelist |
| API 404 | Check VITE_API_URL in frontend env |
| Token Not Found | Clear localStorage: `localStorage.clear()` |
| Build Failed | Check for syntax errors in components |
| Port Already in Use | Kill process or use different port |

---

## 📊 Project Structure

```
/NEW
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Business logic (auth, pizza, order, admin)
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── server.js        # Entry point
│   └── vercel.json      # Vercel config
│
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # State management (auth, store)
│   │   ├── services/    # API client
│   │   ├── pages/       # Route pages
│   │   └── App.jsx      # Root component
│   ├── .env             # Local dev env
│   ├── .env.production  # Production env
│   └── vercel.json      # Vercel config
│
├── DEPLOYMENT_GUIDE.md      # Detailed deployment guide
├── INTEGRATION_SUMMARY.md   # Technical integration details
└── start-dev.bat/.sh        # Quick start scripts
```

---

## 🔗 API Quick Reference

### Authentication
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `GET /api/auth/profile` - Get profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Pizzas
- `GET /api/pizzas` - Get all pizzas
- `GET /api/pizzas?category=Salad` - Filter by category
- `GET /api/pizzas/:id` - Get single pizza

### Orders
- `POST /api/orders` - Place order (protected)
- `GET /api/orders/my` - My orders (protected)
- `DELETE /api/orders/:id` - Cancel order (protected)

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard (admin only)
- `GET /api/admin/users` - Users list (admin only)
- `GET /api/admin/orders/recent` - Recent orders (admin only)

---

## 💡 Pro Tips

1. **Test Locally First**
   - Always test locally before deploying to Vercel
   - Check browser console for errors
   - Verify MongoDB connection works

2. **Keep Secrets Safe**
   - Never commit `.env` files
   - Use Vercel's environment variable UI
   - Rotate JWT_SECRET periodically

3. **Monitor Deployments**
   - Check Vercel dashboard for build logs
   - Monitor database usage in MongoDB Atlas
   - Set up alerts for errors

4. **Performance**
   - Frontend builds are optimized by Vite
   - Backend handles concurrent requests
   - Use caching strategies for images

---

## 📞 Quick Help

**Need to restart backend?**
```bash
cd backend && npm run server
```

**Need to rebuild frontend?**
```bash
cd frontend && npm run build
```

**Want to preview production build locally?**
```bash
cd frontend && npm run preview
```

**Need to check dependencies?**
```bash
# Backend
cd backend && npm list

# Frontend  
cd frontend && npm list
```

---

## ✅ Deployment Success Indicators

- [ ] Frontend loads without errors
- [ ] No CORS errors in console
- [ ] Can register and login
- [ ] Can add items to cart
- [ ] Can complete checkout
- [ ] Console has no red errors
- [ ] Network tab shows successful API calls
- [ ] Page loads in < 3 seconds

---

## 🎯 Next Steps

1. ✅ Backend ready for deployment
2. ✅ Frontend ready for deployment
3. ✅ All integrations complete
4. 📋 Deploy to Vercel
5. 🧪 Test in production
6. 🚀 Go live!

---

**For detailed instructions, see DEPLOYMENT_GUIDE.md**

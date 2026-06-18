import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connectDB } from "./config/db.js"
import { errorHandler, notFound } from "./middleware/errorMiddleware.js"

// Import Routes
import authRoutes from "./routes/authRoutes.js"
import pizzaRoutes from "./routes/pizzaRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"

dotenv.config()

// app config
const app = express()
const port = process.env.PORT || 4000

// Allow multiple origins for Vercel and local development
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean)

// middleware
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// db connection
connectDB();

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/pizzas", pizzaRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/admin", adminRoutes)

// Health check endpoint
app.get("/",(req,res)=>{
    res.status(200).json({
      success: true,
      message: "Pizza Palace API is running",
      timestamp: new Date().toISOString()
    })
})

// 404 handler
app.use(notFound)

// Error handler (must be last)
app.use(errorHandler)

const server = app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(() => {
    console.log('HTTP server closed')
  })
})


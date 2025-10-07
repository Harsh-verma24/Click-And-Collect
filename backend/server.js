const express=require("express")
const app=express();
const cors=require('cors')
const dotenv=require('dotenv').config()
const db=require('./config/db')
const PORT=process.env.PORT||2005
const sellerLogin=require('./routes/sellerLoginRoute')
const userLogin=require('./routes/userLoginRoutes')
const userProfile=require('./routes/userProfileRoute')
const sellerProductUpload=require('./routes/sellerProductUploadRoute')
const cart=require('./routes/userCartRoute')
const order=require('./routes/orderRoutes')
const like=require('./routes/likeRoutes')
const debugRoutes=require('./routes/debugRoutes')
const paymentRoutes=require('./routes/paymentRoutes')
app.use(express.json())

// Configure CORS to only allow the configured frontend origin(s)
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://click-and-collect-eta.vercel.app'
const corsOptions = {
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true)
        const allowed = [FRONTEND_URL]
        if (allowed.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
app.use('/api/sellerLogin',sellerLogin)
app.use('/api/userLogin',userLogin)
app.use('/api/userProfile',userProfile)
app.use('/api/sellerProductUpload',sellerProductUpload)
app.use('/api/cart',cart)
app.use('/api/like',like)
app.use('/api/order',order)
app.use('/api/debug', debugRoutes)
app.use('/api/payment', paymentRoutes)
// start server with error handling
const start = async () => {
    try {
        // ensure DB connects before accepting requests
        await db()
        const server = app.listen(PORT, () => {
            console.log(`Server is listening on port ${PORT}`)
        })

        server.on('error', (err) => {
            if (err && err.code === 'EADDRINUSE') {
                console.error(`Port ${PORT} is already in use. Please free the port or set a different PORT environment variable.`)
            } else {
                console.error('Server error:', err)
            }
            process.exit(1)
        })
    } catch (err) {
        console.error('Failed to start server:', err)
        process.exit(1)
    }
}

// global error handlers to surface unexpected issues
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err)
    process.exit(1)
})

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason)
    process.exit(1)
})

start()
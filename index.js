const express = require('express');
const cors = require('cors');
const session = require('express-session');
const dotenv = require('dotenv');
const sequelize = require('./config/Database');
const SequelizeStore = require('connect-session-sequelize');
const path = require('path');  // Tambahkan ini untuk mengakses path
const UserRoute = require('./routes/UserRoute');
const ProductRoute = require('./routes/ProductRoute');
const AuthRoute = require('./routes/AuthRoute');
const TokenRoute = require('./routes/TokenRoute');
const CartRoute = require('./routes/CartRoute');
const BlogRoute = require('./routes/BlogRoute');
const orderRoutes = require('./routes/orderRoutes');
const TestimoniRoute = require('./routes/TestimoniRoute')
const Session = require('./models/Session');
require('./associations');

dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: sequelize
});

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());

// Middleware untuk mengakses folder 'uploads' sebagai static file
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));  // Tambahkan ini

// Route definitions
app.use(UserRoute);
app.use('/products', ProductRoute);
app.use(AuthRoute);
app.use('/api/token', TokenRoute);
app.use(CartRoute);
app.use('/blogs', BlogRoute);
app.use('/testimoni', TestimoniRoute);
app.use('/api/orders', orderRoutes);

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running');
});

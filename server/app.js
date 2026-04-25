import express from 'express';
import cors from 'cors';
import authRoutes from './src/modules/auth/auth.routes.js';
import productRoutes from './src/modules/product/product.routes.js';
import cartRoutes from './src/modules/cart/cart.routes.js';
import orderRoutes from './src/modules/order/order.routes.js';

// --- create Express app ---
const app = express()

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/images', express.static('/public/images'));
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

export default app;
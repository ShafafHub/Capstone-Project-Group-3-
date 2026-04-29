import express from 'express';
import cors from 'cors';
import authRoutes from './src/modules/auth/auth.routes.js';
import productRoutes from './src/modules/product/product.routes.js';
import cartRoutes from './src/modules/cart/cart.routes.js';
import orderRoutes from './src/modules/order/order.routes.js';
import path from 'path';
import categoryRoutes from './src/modules/category/category.routes.js';
// Add to app.js
import adminRoutes from './src/modules/admin/admin.routes.js';
import favoriteRoutes from './src/modules/favorite/favorite.routes.js';

// --- Create Express app ---
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/favicon.ico', (req, res) => res.status(204).end());

// --- API routes ---
app.use('/api/favorites', favoriteRoutes);
app.use('/api/auth', authRoutes);
app.use('/images', express.static(path.join(process.cwd(), 'public/images')));
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

export default app;
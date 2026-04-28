// --- import dependencies & routes ---
import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './src/modules/auth/auth.routes.js';
import productRoutes from './src/modules/product/product.routes.js';
import cartRoutes from './src/modules/cart/cart.routes.js';
import orderRoutes from './src/modules/order/order.routes.js';
import categoryRoutes from './src/modules/category/category.routes.js';
import adminRoutes from './src/modules/admin/admin.routes.js';

// --- create and configure Express app ---
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(process.cwd(), 'public/images')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/admin', adminRoutes);

export default app;
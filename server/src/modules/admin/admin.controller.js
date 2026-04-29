export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  const ADMIN_EMAIL = 'admin@test.com';
  const ADMIN_PASSWORD = '123456';
  
  // --- Check admin credentials ---
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    // --- Return simple session response ---
    res.json({ 
      success: true, 
      admin: { email, role: 'admin' },
      message: 'Login successful'
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
};

export const getDashboardData = async (req, res) => {
  const db = req.app.locals.db;
  
  try {
    // --- Fetch all required dashboard data ---
    const products = await db('products').orderBy('id', 'desc');
    const categories = await db('categories');
    const orders = await db('orders').orderBy('id', 'desc').limit(10);
    const users = await db('users').select('id', 'email', 'role');
    
    res.json({
      success: true,
      data: {
        products,
        categories,
        orders,
        users,
        stats: {
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalCategories: categories.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
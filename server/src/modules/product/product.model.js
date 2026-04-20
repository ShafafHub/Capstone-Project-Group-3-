export const getAllProducts = async (db) => {
  return db.all('SELECT * FROM products');
};

export const getProductById = async (db, id) => {
  return db.get('SELECT * FROM products WHERE id = ?', [id]);
};

export const createProduct = async (db, product) => {
  const { name, price, description, image } = product;

  const result = await db.run(
    `INSERT INTO products (name, price, description, image)
     VALUES (?, ?, ?, ?)`,
    [name, price, description, image]
  );

  return { id: result.lastID, ...product };
};
exports.seed = async function (knex) {
  // --- Check if categories already exist ---
  const exists = await knex('categories').first();
  
  if (exists) {
    console.log('Categories already exist, skipping seed...');
    return;
  }

  // --- Insert initial categories ---
  await knex('categories').insert([
    { name: 'men', image: '/images/men-category.jpg' },
    { name: 'women', image: '/images/women-category.jpg' },
    { name: 'kids', image: '/images/kids-category.jpg' },
    { name: 'accessories', image: '/images/accessories.jpg' },
  ]);

  console.log('Categories seeded successfully!');
};
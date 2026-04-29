import bcrypt from 'bcryptjs';

export async function seed(knex) {
  // --- Check if admin user already exists ---
  const exists = await knex('users')
    .where({ email: 'admin@test.com' })
    .first();

  // --- Skip if already exists ---
  if (exists) return;

  // --- Hash the password ---
  const hashed = await bcrypt.hash('123456', 10);

  // --- Insert admin user ---
  await knex('users').insert({
    email: 'admin@test.com',
    password: hashed,
    role: 'admin'
  });
}
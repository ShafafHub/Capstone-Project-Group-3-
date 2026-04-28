export const getUserById = (db, id) =>
  db('users').select('id', 'email').where({ id }).first()
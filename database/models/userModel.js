const {
  createUser,
  findUserByEmail,
} = require("../queries/userQueries");

class UserModel {
  static async create(email, password) {
    return await createUser(email, password);
  }

  static async findByEmail(email) {
    return await findUserByEmail(email);
  }
}

module.exports = UserModel;
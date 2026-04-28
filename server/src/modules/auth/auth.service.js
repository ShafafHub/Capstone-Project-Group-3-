import { hashPassword, comparePassword } from "../../utils/hash.js";

export const registerUser = async (db, email, password) => {
  email = email.toLowerCase().trim();

  const existingUser = await db("users").where({ email }).first();

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);

  await db("users").insert({
    email,
    password: hashedPassword,
    role: "user",
  });

  const newUser = await db("users")
    .select("id", "email", "role")
    .where({ email })
    .first();

  return newUser;
};

export const loginUser = async (db, email, password) => {
  const user = await db("users").where({ email }).first();

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await comparePassword(
    password,
    user.password
  );

  if (!isValidPassword) {
    throw new Error("Wrong password");
  }

  delete user.password;

  return user;
};
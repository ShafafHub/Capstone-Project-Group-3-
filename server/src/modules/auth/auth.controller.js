// --- auth controllers: register and login ---
import { registerUser, loginUser } from './auth.service.js';
import { generateToken } from '../../utils/jwt.js';

// --- register new user ---
export const register = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    const user = await registerUser(db, email, password);
    const token = generateToken(user);

    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// --- login existing user ---
export const login = async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { email, password } = req.body;

    const user = await loginUser(db, email, password);
    const token = generateToken(user);

    res.json({ user, token });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};
import { registerUser, loginUser } from './auth.service.js';
import { generateToken } from '../../utils/jwt.js';

// --- Register ---
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await registerUser(email, password);

    const token = generateToken(user);

    res.status(201).json({
      user,
      token,
    });

  } catch (err) {
    res.status(err.status || 400).json({
      message: err.message,
    });
  }
};

// --- Login ---
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    const token = generateToken(user);

    res.json({
      user,
      token,
    });

  } catch (err) {
    res.status(err.status || 400).json({
      message: err.message,
    });
  }
};
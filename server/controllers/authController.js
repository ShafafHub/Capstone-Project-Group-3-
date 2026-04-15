import bcrypt from "bcrypt";
import{
    createUser,
    findUserByEmail,
} from "../../database/queries/userQueries.js";

// --- Register a new user ---
export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- Validate input ---

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        // --- Check if user already exists ---
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // --- Hash password ---
        const hashedPassword = await bcrypt.hash(password, 10);

        // --- Create user ---
        const newUser = await createUser(email, hashedPassword);

        // --- Success response ---
        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                email: newUser.email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }  
};

// --- Login User ---
export const login = async (req, res) => {
    try{
        const { email, password } = req.body;

        // --- Validate input ---

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        } 

        // --- Find User ---
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // --- Compare password ---
        if (!user || !user.password) {
        return res.status(500).json({
        message: "Login failed due to server issue",
      });
    }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        // --- Success response ---
        return res.status(200).json({
            message: "Login successful",
            user: {
               id: user.id,
               email: user.email,
            },
        });
    } catch(error) {
        return res.status(500).json({
            message: "Server error",
            error: error.message,
        });
    }
};
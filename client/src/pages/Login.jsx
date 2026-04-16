import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post("/auth/login", form);

            login(res.data.user);
            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-80">

                <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
                    />

                    <button
                        disabled={loading}
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>

                </form>

                <p className="text-center mt-4 text-sm">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-indigo-600">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
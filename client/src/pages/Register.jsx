import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api"

function Register() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error ,setError] = useState(""); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            setError("Email and password are required");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            const res = await API.post("/auth/register", {
                email: form.email,
                password: form.password,
                name: form.name
            });
            
            setError("");
            alert(res.data.message || "Account created!");
            navigate("/login");

        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-2">
                    Create an Account
                </h2>

                <p className="text-center text-sm text-gray-500 mb-6">
                    Have an account?{" "}
                    <Link to="/login" className="text-blue-600">
                        Sign In
                    </Link>
                </p>

                <form onSubmit={handleSubmit}>
                    <label className="text-sm text-gray-500">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Email Address"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <label className="text-sm text-gray-500">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Create Password"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                        {error && (
                            <p className="text-red-500 text-sm mb-2">{error}</p>
                        )}
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                        Register
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-4">
                    By creating account, you agree to our{" "}
                    <span className="text-blue-600">Terms of Service</span>
                </p>
            </div>
        </div>
    );
}

export default Register;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api"

function Register() {
    const [form, setForm] = useState({
        name: "",
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
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
                <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-lg placeholder-gray-400"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-lg placeholder-gray-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-lg placeholder-gray-400"
                    />
                        {error && (
                            <p className="text-red-500 text-sm mb-2">{error}</p>
                        )}
                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                        Register
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-600">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
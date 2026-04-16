import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));

        // ✅ simple check
        if (
            user &&
            user.email === form.email &&
            user.password === form.password
        ) {
            navigate("/dashboard");
        } else {
            alert("Invalid email or password");
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
                        className="w-full mb-4 px-3 py-2 border rounded-lg placeholder-gray-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-lg placeholder-gray-400"
                    />

                    <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                        Login
                    </button>
                </form>

                <p className="text-center mt-4 text-sm">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-indigo-600">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
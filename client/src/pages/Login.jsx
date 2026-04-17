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
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-semibold text-center mb-2">Sign In</h2>

                <p className="text-center text-sm text-gray-500 mb-6">
                    New to our product?{" "}
                    <Link to="/register" className="text-blue-600">
                        Create an account
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
                        placeholder="Enter Password"
                        onChange={handleChange}
                        className="w-full mb-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />

                    <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                        Login
                    </button>
                </form>

                <p className="text-center mt-4 text-sm text-blue-600 cursor-pointer">
                    Forgot your password?
                </p>
            </div>
        </div>
    );
}

export default Login;
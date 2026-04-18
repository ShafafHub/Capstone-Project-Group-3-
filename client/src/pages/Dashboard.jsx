import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function Dashboard() {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">

                <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

                <p className="mb-4">
                    Welcome {user?.email || "User"}
                </p>

                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
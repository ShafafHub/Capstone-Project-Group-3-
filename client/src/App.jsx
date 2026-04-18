import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />

                <Route
                    path="/login"
                    element={user ? <Navigate to="/dashboard" /> : <Login />}
                />

                <Route
                    path="/register"
                    element={user ? <Navigate to="/dashboard" /> : <Register />}
                />

                <Route
                    path="/dashboard"
                    element={user ? <Dashboard /> : <Navigate to="/login" />}
                />

                <Route path="*" element={<div>404 Not Found</div>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
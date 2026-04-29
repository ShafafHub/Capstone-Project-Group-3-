import { useNavigate } from "react-router-dom";
import prev from "../assets/prev.png";

export default function Bag() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f6f6f6] px-10 py-8">
            <div className="max-w-5xl mx-auto">


                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 mb-6 text-base text-gray-500 hover:text-black"
                >
                    <img src={prev} alt="back" className="w-8 h-6" />
                    Back
                </button>


                <h1 className="text-3xl font-bold tracking-wide mb-6">
                    BAG
                </h1>

                <h2 className="text-lg text-gray-500">
                    Your Bag Is Empty
                </h2>

            </div>
        </div>
    );
}
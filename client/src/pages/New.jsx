import { useEffect, useState } from "react";
import api from "../services/api";

export default function New() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/products");

                const filtered = res.data.filter(
                    (item) => item.is_new === true || item.is_new === 1
                );

                setProducts(filtered);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="max-w-[1200px] mx-auto px-4 py-6">
            <h1 className="text-2xl font-semibold tracking-[2px] mb-6">
                NEW COLLECTION 2026
            </h1>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {products.map((item) => (
                    <div key={item.id} className="p-3">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-[200px] object-contain mb-2"
                        />

                        <h2 className="text-sm font-medium">{item.name}</h2>

                        <p className="text-xs text-gray-500">{item.description}</p>

                        <p className="text-sm font-bold mt-2">{item.price}$</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
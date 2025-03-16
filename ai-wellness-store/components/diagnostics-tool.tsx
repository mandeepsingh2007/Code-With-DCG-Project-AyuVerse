"use client";
import { useState } from "react";

export default function DiagnosticsTool() {
    const [file, setFile] = useState<File | null>(null);
    const [analysis, setAnalysis] = useState("");
    const [products, setProducts] = useState([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return alert("Please select a PDF");

        const formData = new FormData();
        formData.append("file", file);

        try {
            // Step 1: Extract data from PDF
            const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
            if (!uploadRes.ok) throw new Error(`Upload failed: ${uploadRes.status}`);

            const { vitalSigns } = await uploadRes.json();

            // Step 2: Analyze with AI
            const analyzeRes = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ vitalSigns }),
            });

            if (!analyzeRes.ok) throw new Error(`Analyze API failed: ${analyzeRes.status}`);

            const { analysis } = await analyzeRes.json();
            setAnalysis(analysis);

            // Step 3: Fetch Shopify products
            const shopifyRes = await fetch("/api/shopify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ keywords: analysis }),
            });

            if (!shopifyRes.ok) throw new Error(`Shopify API failed: ${shopifyRes.status}`);

            const { products } = await shopifyRes.json();
            setProducts(products);
        } catch (error) {
            console.error("Error in handleUpload:", error);
            alert(error instanceof Error ? error.message : "An unexpected error occurred.");
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Upload Vital Signs Report (PDF)</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="mb-4" />
            <button onClick={handleUpload} className="px-4 py-2 bg-blue-600 text-white rounded">
                Analyze & Get Recommendations
            </button>

            {analysis && (
                <div className="mt-4 p-4 border">
                    <h3 className="text-lg font-bold">AI Analysis</h3>
                    <p>{analysis}</p>
                </div>
            )}

            {products.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-bold">Recommended Products</h3>
                    <ul>
                        {products.map((product: any) => (
                            <li key={product.node.id} className="p-2 border mt-2">
                                <img src={product.node.images.edges[0]?.node.src} alt={product.node.title} className="w-20 h-20" />
                                <h4 className="text-md font-semibold">{product.node.title}</h4>
                                <p>{product.node.variants.edges[0].node.price} USD</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

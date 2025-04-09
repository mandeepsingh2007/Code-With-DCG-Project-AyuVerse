import { useState } from "react";

export default function DiagnosticsTool() {
  const [file, setFile] = useState<File | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const res = await fetch("http://127.0.0.1:8000/recommend/", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          throw new Error(errorData.message || "Upload failed");
        } catch {
          throw new Error("Server returned an invalid response");
        }
      }

      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />

      {loading && <p>Uploading and processing file...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {products.length > 0 && (
        <div>
          <h2>Recommended Products</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
            {products.map((product) => {
              console.log("Product Data:", product); // Debugging

              return (
                <div key={product.Name} style={{ border: "1px solid #ddd", padding: "10px", borderRadius: "8px", textAlign: "center" }}>
                  <h3>{product.Name}</h3>

                  <img
                    src={product.ImageURL || "/placeholder.jpg"}
                    style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                  />

                  <p>{product.Description}</p>
                  <p><strong>Price:</strong> {product.Price}</p>
                  <button onClick={() => window.open("https://aiwellnessstore.myshopify.com/products/shankhpushpi-syrup-anxiety-stress-relief?_pos=1&_psq=shan&_ss=e&_v=1.0")}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-2 px-6 rounded-lg shadow-lg hover:from-red-600 hover:to-orange-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50"
                  >
                    BUY NOW
                  </button>

                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

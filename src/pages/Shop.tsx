import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/data/defaultProducts";
import { useState } from "react";

const Shop = () => {
  const products = getProducts();
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const [cat, setCat] = useState("All");

  const filtered = cat === "All" ? products : products.filter((p) => p.category === cat);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Shop</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              cat === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-primary/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {filtered.length === 0 && <p className="mt-8 text-center text-muted-foreground">No products found.</p>}
    </div>
  );
};

export default Shop;

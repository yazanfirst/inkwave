import HeroBanner from "@/components/HeroBanner";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/data/defaultProducts";
import { motion } from "framer-motion";

const Index = () => {
  const products = getProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);

  return (
    <>
      <HeroBanner />
      <section className="container mx-auto px-4 py-16">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-foreground">
            Featured Products
          </h2>
          <p className="mt-2 text-center text-muted-foreground">Our most popular custom prints</p>
        </motion.div>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Index;

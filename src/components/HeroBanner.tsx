import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroBanner = () => (
  <section className="relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroBg} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-foreground/60" />
    </div>
    <div className="relative container mx-auto px-4 py-24 md:py-36">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl"
      >
        <h1 className="text-4xl md:text-6xl font-display font-black text-primary-foreground leading-tight">
          Express Yourself With <span className="text-accent">Vibrant</span> Prints
        </h1>
        <p className="mt-4 text-lg text-primary-foreground/80 font-light">
          Premium print on demand products — custom t-shirts, mugs, phone cases and more. Designed to stand out.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
        >
          Shop Now <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroBanner;

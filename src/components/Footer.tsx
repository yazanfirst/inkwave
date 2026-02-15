import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => (
  <footer className="border-t border-border bg-card mt-16">
    <div className="container mx-auto px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <img src={logo} alt="InkWave Prints" className="h-16 w-auto mb-3" />
          <p className="text-sm text-muted-foreground">Premium print on demand products. Express yourself with vibrant, custom designs.</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link>
            <Link to="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shop</Link>
            <Link to="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cart</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-3">Contact</h4>
          <p className="text-sm text-muted-foreground">Email: aiahmednmer26@gmail.com</p>
          <p className="text-sm text-muted-foreground">UAE, Dubai</p>
        </div>
      </div>
      <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
        © 2026 InkWave Prints. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

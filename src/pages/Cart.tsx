import { useCart } from "@/context/CartContext";
import { Trash2, Plus, Minus, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const { items, removeItem, updateQuantity, total, couponCode, setCouponCode, discount, applyCoupon } = useCart();

  const handleApply = () => {
    if (applyCoupon()) toast.success("Coupon applied!");
    else toast.error("Invalid coupon code");
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-display font-bold text-foreground">Your Cart is Empty</h1>
        <p className="mt-2 text-muted-foreground">Add some products to get started!</p>
        <Link to="/shop" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
          Browse Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-display font-bold text-foreground">Shopping Cart</h1>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border border-border bg-card p-4">
              <img src={item.image} alt={item.name} className="h-20 w-20 rounded-md object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.price} AED</p>
                <div className="mt-2 flex items-center gap-2">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded bg-muted p-1 hover:bg-primary/10">
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded bg-muted p-1 hover:bg-primary/10">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <span className="font-bold text-foreground">{item.price * item.quantity} AED</span>
                <button onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 h-fit">
          <h3 className="font-display text-lg font-bold text-card-foreground">Order Summary</h3>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Coupon code"
                className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 text-sm"
              />
              <button onClick={handleApply} className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground hover:bg-accent/90">
                Apply
              </button>
            </div>
            {discount > 0 && <p className="text-sm text-green-600">Discount: -{discount.toFixed(2)} AED</p>}
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-lg font-bold text-foreground">
                <span>Total</span>
                <span>{total.toFixed(2)} AED</span>
              </div>
            </div>
          </div>
          <Link
            to="/checkout"
            className="mt-6 block w-full rounded-lg bg-secondary py-3 text-center font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;

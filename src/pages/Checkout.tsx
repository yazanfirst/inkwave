import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Truck } from "lucide-react";

const Checkout = () => {
  const { items, total, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const payment = "cod";
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", email: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address || !form.city) {
      toast.error("Please fill all required fields");
      return;
    }
    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem("inkwave-orders") || "[]");
    orders.push({
      id: Date.now().toString(),
      items,
      total,
      discount,
      payment,
      customer: form,
      date: new Date().toISOString(),
      status: "pending",
    });
    localStorage.setItem("inkwave-orders", JSON.stringify(orders));
    clearCart();
    toast.success("Order placed successfully! 🎉");
    navigate("/");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <h1 className="text-3xl font-display font-bold text-foreground">Checkout</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-card-foreground">Delivery Information</h3>
          {(["name", "email", "phone", "address", "city"] as const).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-foreground capitalize mb-1">{field} {field !== "email" && "*"}</label>
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required={field !== "email"}
              />
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <h3 className="font-semibold text-card-foreground">Payment Method</h3>
          <div className="flex items-center gap-3 rounded-lg border-2 border-primary bg-primary/5 p-4 text-sm font-medium text-primary">
            <Truck className="h-5 w-5" /> Cash on Delivery
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="flex justify-between text-lg font-bold text-foreground">
            <span>Total</span>
            <span>{total.toFixed(2)} AED</span>
          </div>
          {discount > 0 && <p className="text-sm text-green-600 mt-1">Includes discount: -{discount.toFixed(2)} AED</p>}
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-secondary py-3 font-semibold text-secondary-foreground hover:bg-secondary/90 transition-colors"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;

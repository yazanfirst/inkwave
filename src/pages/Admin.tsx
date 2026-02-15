import { useState, useEffect, type ChangeEvent } from "react";
import { getProducts, saveProducts, type Product } from "@/data/defaultProducts";
import { toast } from "sonner";
import { Trash2, Plus, Package, Tag, ShoppingBag, LogOut, TrendingUp, BarChart3, ImagePlus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  active: boolean;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || isAdmin === false)) {
      navigate("/admin-login");
    }
  }, [user, isAdmin, loading, navigate]);

  const [tab, setTab] = useState<"products" | "coupons" | "orders">("products");
  const [products, setProducts] = useState<Product[]>(getProducts());
  const [coupons, setCoupons] = useState<Coupon[]>(() => JSON.parse(localStorage.getItem("inkwave-coupons") || "[]"));
  const orders = JSON.parse(localStorage.getItem("inkwave-orders") || "[]");

  const [pForm, setPForm] = useState({ name: "", description: "", price: "", category: "", image: "", featured: false });
  const [cForm, setCForm] = useState({ code: "", type: "percentage" as "percentage" | "fixed", value: "" });

  useEffect(() => {
    const saved = saveProducts(products);
    if (!saved) {
      toast.error("Product changes could not be saved in browser storage. Try a smaller image.");
    }
  }, [products]);
  useEffect(() => { localStorage.setItem("inkwave-coupons", JSON.stringify(coupons)); }, [coupons]);

  const addProduct = () => {
    if (!pForm.name || !pForm.price || !pForm.category) { toast.error("Fill required fields"); return; }
    const newP: Product = {
      id: Date.now().toString(),
      name: pForm.name,
      description: pForm.description,
      price: Number(pForm.price),
      category: pForm.category,
      image: pForm.image || "/placeholder.svg",
      featured: pForm.featured,
    };
    setProducts([...products, newP]);
    setPForm({ name: "", description: "", price: "", category: "", image: "", featured: false });
    toast.success("Product added!");
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Product deleted");
  };

  const addCoupon = () => {
    if (!cForm.code || !cForm.value) { toast.error("Fill required fields"); return; }
    setCoupons([...coupons, { id: Date.now().toString(), code: cForm.code.toUpperCase(), type: cForm.type, value: Number(cForm.value), active: true }]);
    setCForm({ code: "", type: "percentage", value: "" });
    toast.success("Coupon created!");
  };

  const deleteCoupon = (id: string) => {
    setCoupons(coupons.filter((c) => c.id !== id));
    toast.success("Coupon deleted");
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeBytes = 1024 * 1024; // 1MB
    if (file.size > maxSizeBytes) {
      toast.error("Image is too large. Please upload an image under 1MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPForm({ ...pForm, image: reader.result as string });
    reader.readAsDataURL(file);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || isAdmin === false) return null;

  if (isAdmin === null) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            We're still verifying your admin permissions. Please wait a moment...
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: "products" as const, label: "Products", icon: Package, count: products.length },
    { key: "coupons" as const, label: "Coupons", icon: Tag, count: coupons.length },
    { key: "orders" as const, label: "Orders", icon: ShoppingBag, count: orders.length },
  ];

  const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Manage your store</p>
          </div>
          <button onClick={handleSignOut} className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Package className="h-4 w-4" />
              <span className="text-xs font-medium">Products</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{products.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <ShoppingBag className="h-4 w-4" />
              <span className="text-xs font-medium">Orders</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{totalRevenue.toFixed(0)} <span className="text-sm font-normal text-muted-foreground">AED</span></p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Tag className="h-4 w-4" />
              <span className="text-xs font-medium">Coupons</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{coupons.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all flex-1 justify-center ${
                tab === t.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                tab === t.key ? "bg-primary/10 text-primary" : "bg-background text-muted-foreground"
              }`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {tab === "products" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Plus className="h-4 w-4 text-primary" /> Add New Product
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Product Name *</label>
                  <input value={pForm.name} onChange={(e) => setPForm({ ...pForm, name: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Price (AED) *</label>
                  <input type="number" value={pForm.price} onChange={(e) => setPForm({ ...pForm, price: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category *</label>
                  <input value={pForm.category} onChange={(e) => setPForm({ ...pForm, category: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Product Image</label>
                  <label className="flex items-center gap-2 cursor-pointer rounded-lg border border-dashed border-input bg-background px-3 py-2.5 text-sm text-muted-foreground hover:border-primary/50 transition-all">
                    <ImagePlus className="h-4 w-4" />
                    {pForm.image ? "Image selected ✓" : "Choose file..."}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">Description</label>
                <textarea value={pForm.description} onChange={(e) => setPForm({ ...pForm, description: e.target.value })}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" rows={2} />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input type="checkbox" checked={pForm.featured} onChange={(e) => setPForm({ ...pForm, featured: e.target.checked })}
                    className="rounded border-input" />
                  Featured Product
                </label>
                <button onClick={addProduct} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Add Product
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {products.map((p) => (
                <div key={p.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                  <img src={p.image} alt={p.name} className="h-12 w-12 rounded-lg object-cover bg-muted" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground text-sm truncate">{p.name}</h4>
                    <p className="text-xs text-muted-foreground">{p.category} · <span className="font-semibold text-foreground">{p.price} AED</span></p>
                  </div>
                  {p.featured && <span className="hidden sm:inline rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Featured</span>}
                  <button onClick={() => deleteProduct(p.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {tab === "coupons" && (
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <Plus className="h-4 w-4 text-primary" /> Create Coupon
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Code *</label>
                  <input value={cForm.code} onChange={(e) => setCForm({ ...cForm, code: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Type</label>
                  <select value={cForm.type} onChange={(e) => setCForm({ ...cForm, type: e.target.value as "percentage" | "fixed" })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all">
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed (AED)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">Value *</label>
                  <input type="number" value={cForm.value} onChange={(e) => setCForm({ ...cForm, value: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button onClick={addCoupon} className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Create Coupon
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {coupons.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                  <Tag className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No coupons yet. Create your first one above.</p>
                </div>
              )}
              {coupons.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Tag className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-mono font-bold text-foreground text-sm">{c.code}</span>
                      <p className="text-xs text-muted-foreground">
                        {c.type === "percentage" ? `${c.value}% off` : `${c.value} AED off`}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteCoupon(c.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === "orders" && (
          <div className="space-y-2">
            {orders.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No orders yet. They'll appear here when customers place them.</p>
              </div>
            )}
            {orders.map((o: any) => (
              <div key={o.id} className="rounded-xl border border-border bg-card p-5 hover:shadow-sm transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-foreground">{o.customer.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.customer.phone} · {o.customer.city}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{new Date(o.date).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">{o.total.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">AED</span></p>
                    <span className="inline-block mt-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">COD</span>
                  </div>
                </div>
                <div className="mt-3 rounded-lg bg-muted/50 p-2.5 text-xs text-muted-foreground">
                  {o.items.map((i: any) => `${i.name} ×${i.quantity}`).join(" · ")}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

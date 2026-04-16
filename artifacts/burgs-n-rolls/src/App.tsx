import { useState, useCallback } from "react";
import { ShoppingCart } from "lucide-react";
import { menuItems, categories } from "./data/menu";
import type { MenuItem } from "./data/menu";
import { MenuCard } from "./components/MenuCard";
import { CartDrawer } from "./components/CartDrawer";

export interface CartItem extends MenuItem {
  qty: number;
}

export default function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("wraps");
  const [cartBounce, setCartBounce] = useState(false);

  const totalQty = cartItems.reduce((sum, i) => sum + i.qty, 0);

  const addToCart = useCallback((item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const filtered = menuItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-sm">
              <span className="text-white font-black text-xs leading-tight text-center">B&R</span>
            </div>
            <div>
              <h1 className="font-black text-lg text-foreground leading-none tracking-tight">Burgs & Rolls</h1>
              <p className="text-xs text-muted-foreground">Where Spices Start Speaking</p>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className={`relative flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 cursor-pointer shadow-sm ${
              cartBounce ? "animate-cart-bounce" : ""
            }`}
          >
            <ShoppingCart size={16} />
            <span>Cart</span>
            {totalQty > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
                {totalQty}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pb-12">
        <div className="pt-6 pb-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <div key={item.id} style={{ animationDelay: `${i * 0.05}s` }}>
              <MenuCard item={item} onAddToCart={addToCart} />
            </div>
          ))}
        </div>

        {activeCategory === "wraps" && (
          <div className="mt-8 bg-primary/5 border border-primary/20 rounded-2xl p-4 text-center">
            <p className="text-sm font-semibold text-primary">🎉 Every Friday — Special Biryani!</p>
            <p className="text-xs text-muted-foreground mt-1">Her Cuma Günü Tavuk Biryani</p>
          </div>
        )}
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onClear={clearCart}
      />
    </div>
  );
}

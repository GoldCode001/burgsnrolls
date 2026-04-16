import { useState } from "react";
import type { MenuItem } from "../data/menu";
import { ShoppingCart, Plus, Check } from "lucide-react";

interface MenuCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export function MenuCard({ item, onAddToCart }: MenuCardProps) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border flex flex-col transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 animate-slide-up">
      <div className="relative w-full aspect-[4/3] bg-secondary overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span className="text-5xl font-black text-primary/20">{item.code}</span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Coming soon</span>
          </div>
        )}
        <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
          {item.code}
        </span>
        <span className="absolute top-2 right-2 bg-white/90 text-foreground text-sm font-bold px-2.5 py-0.5 rounded-full shadow-sm">
          {item.price}
        </span>
      </div>

      <div className="p-4 flex flex-col flex-1 gap-3">
        <h3 className="font-bold text-base text-foreground leading-tight">{item.name}</h3>

        {item.ingredients.length > 0 && (
          <p className="text-xs text-muted-foreground leading-relaxed flex-1">
            {item.ingredients.join(" · ")}
          </p>
        )}

        <button
          onClick={handleAdd}
          className={`mt-auto flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
            added
              ? "bg-green-500 text-white"
              : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
          }`}
        >
          {added ? (
            <>
              <Check size={15} />
              Added!
            </>
          ) : (
            <>
              <Plus size={15} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

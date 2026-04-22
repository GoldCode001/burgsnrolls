import { X, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import type { CartItem } from "../App";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

const WHATSAPP_NUMBER = "905488414151";

export function CartDrawer({ open, onClose, items, onRemove, onClear }: CartDrawerProps) {
  const total = items.reduce((sum, i) => {
    const n = parseFloat(i.price.replace(/[^\d.,]/g, "").replace(",", "."));
    return Number.isFinite(n) ? sum + n * i.qty : sum;
  }, 0);
  const hasUnpriced = items.some((i) => !Number.isFinite(parseFloat(i.price.replace(/[^\d.,]/g, "").replace(",", "."))));

  function placeOrder() {
    if (items.length === 0) return;

    const lines = items.map(
      (i) => `• ${i.qty}x ${i.code} - ${i.name} (${i.price} each)`
    );
    const message = [
      "🍔 *Order from Burgs & Rolls*",
      "",
      ...lines,
      "",
      `💰 *Total: ${total.toFixed(0)}₺*`,
      "",
      "Please confirm my order. Thank you!",
    ].join("\n");

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, "_blank");
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-bold text-lg text-foreground flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            Your Order
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center py-12">
              <ShoppingBag size={48} className="text-muted-foreground/30" />
              <p className="text-muted-foreground text-sm">Your cart is empty.<br />Add something delicious!</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-secondary rounded-xl p-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-primary">{item.code}</span>
                    <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.qty} × {item.price}
                  </p>
                </div>
                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Total</span>
              <span className="font-bold text-lg text-foreground">
                {total.toFixed(0)}₺{hasUnpriced ? "+" : ""}
              </span>
            </div>
            {hasUnpriced && (
              <p className="text-xs text-muted-foreground -mt-1">
                Some items are special offers — final price confirmed on WhatsApp.
              </p>
            )}
            <button
              onClick={placeOrder}
              className="w-full bg-green-500 hover:bg-green-600 active:scale-95 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer text-base"
            >
              <MessageCircle size={20} />
              Order via WhatsApp
            </button>
            <button
              onClick={onClear}
              className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors py-1 cursor-pointer"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}

import { useState, useEffect, useCallback } from "react";
import { LogOut, Edit2, Eye, EyeOff, Save, X, ChevronDown, ChevronUp, Loader2 } from "lucide-react";

const API = "";

interface Category {
  id: number;
  code: string;
  label: string;
  displayOrder: number;
  active: boolean;
}

interface MenuItem {
  id: number;
  code: string;
  name: string;
  imageUrl: string | null;
  ingredients: string[];
  categoryCode: string;
  price: string;
  active: boolean;
  displayOrder: number;
}

function useToken() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("author_token"));
  const save = (t: string) => { localStorage.setItem("author_token", t); setToken(t); };
  const clear = () => { localStorage.removeItem("author_token"); setToken(null); };
  return { token, save, clear };
}

function LoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) { setError("Wrong password. Try again."); return; }
      const { token } = await res.json();
      onLogin(token);
    } catch {
      setError("Connection error. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <img src="/logo.jpeg" alt="Burgs & Rolls" className="w-20 h-20 rounded-full mx-auto mb-3 object-cover" />
          <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-500">Burgs & Rolls</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter admin password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

function EditModal({
  item,
  token,
  onSave,
  onClose,
}: {
  item: MenuItem;
  token: string;
  onSave: (updated: MenuItem) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState(item.price);
  const [imageUrl, setImageUrl] = useState(item.imageUrl ?? "");
  const [ingredients, setIngredients] = useState(item.ingredients.join("\n"));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/menu/items/${item.code}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          price: price.trim(),
          imageUrl: imageUrl.trim() || null,
          ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) { setError("Failed to save changes."); return; }
      const updated = await res.json();
      onSave(updated);
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">Edit {item.code}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {item.imageUrl && (
            <img
              src={imageUrl || item.imageUrl}
              alt={item.name}
              className="w-full h-36 object-cover rounded-xl"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Item Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Price</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. 250₺"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Image URL</label>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="https://... or /b1.jpeg"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ingredients (one per line)</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemRow({
  item,
  token,
  onUpdate,
}: {
  item: MenuItem;
  token: string;
  onUpdate: (updated: MenuItem) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [toggling, setToggling] = useState(false);

  const toggle = async () => {
    setToggling(true);
    try {
      const res = await fetch(`${API}/api/menu/items/${item.code}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onUpdate(await res.json());
    } finally {
      setToggling(false);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${item.active ? "bg-white" : "bg-gray-50 opacity-60"}`}>
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-orange-100 shrink-0 flex items-center justify-center text-orange-400 text-xs font-bold">
            {item.code}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{item.name}</p>
          <p className="text-orange-600 font-bold text-sm">{item.price}</p>
          <p className="text-gray-400 text-xs">{item.code}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={toggle}
            disabled={toggling}
            className={`p-2 rounded-lg transition-colors ${item.active ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
            title={item.active ? "Hide item" : "Show item"}
          >
            {toggling ? <Loader2 className="w-4 h-4 animate-spin" /> : item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      {editing && (
        <EditModal
          item={item}
          token={token}
          onSave={(updated) => { onUpdate(updated); setEditing(false); }}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}

function CategorySection({
  category,
  items,
  token,
  onUpdate,
}: {
  category: Category;
  items: MenuItem[];
  token: string;
  onUpdate: (updated: MenuItem) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 rounded-xl text-left"
      >
        <span className="font-bold text-gray-800">{category.label}</span>
        <span className="text-gray-500 text-sm flex items-center gap-1">
          {items.length} items
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>
      {open && (
        <div className="mt-2 space-y-2 px-1">
          {items.map((item) => (
            <ItemRow key={item.id} item={item} token={token} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/menu`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setCategories(data.categories);
      setItems(data.items);
    } catch {
      setError("Failed to load menu. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleUpdate = useCallback((updated: MenuItem) => {
    setItems((prev) => prev.map((i) => i.id === updated.id ? updated : i));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="" className="w-8 h-8 rounded-full object-cover" />
            <div>
              <p className="font-bold text-sm text-gray-900">Admin Panel</p>
              <p className="text-xs text-gray-400">Burgs & Rolls</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="mb-4 p-3 bg-blue-50 rounded-xl text-sm text-blue-700">
          <strong>Tip:</strong> Tap <Edit2 className="w-3 h-3 inline" /> to edit a price or name. Tap <EyeOff className="w-3 h-3 inline" /> to hide an item (e.g. when out of stock).
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading menu...
          </div>
        )}
        {error && (
          <div className="text-center py-10 text-red-500">
            {error}
            <button onClick={load} className="block mx-auto mt-2 text-sm underline">Retry</button>
          </div>
        )}
        {!loading && !error && categories.map((cat) => (
          <CategorySection
            key={cat.id}
            category={cat}
            items={items.filter((i) => i.categoryCode === cat.code).sort((a, b) => a.displayOrder - b.displayOrder)}
            token={token}
            onUpdate={handleUpdate}
          />
        ))}
      </main>
    </div>
  );
}

export default function AuthorPage() {
  const { token, save, clear } = useToken();

  if (!token) return <LoginPage onLogin={save} />;
  return <Dashboard token={token} onLogout={clear} />;
}

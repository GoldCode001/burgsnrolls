import { useState, useEffect, useCallback, useRef } from "react";
import {
  LogOut, Edit2, Eye, EyeOff, X, Loader2, Upload, ChevronDown, ChevronUp,
  ImageIcon, Plus, Trash2,
} from "lucide-react";

const API = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

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

async function apiFetch(
  path: string,
  opts: RequestInit & { token?: string } = {},
): Promise<Response> {
  const { token, headers, ...rest } = opts;
  const res = await fetch(`${API}${path}`, {
    ...rest,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
  });
  if (res.status === 401 && token) {
    localStorage.removeItem("author_token");
    window.location.reload();
  }
  return res;
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

function ImageUploader({
  token,
  currentImageUrl,
  onUploaded,
}: {
  token: string;
  currentImageUrl: string | null;
  onUploaded: (objectPath: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const urlRes = await apiFetch(`/api/storage/uploads/request-url`, {
        method: "POST",
        token,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, contentType: file.type, size: file.size }),
      });
      if (!urlRes.ok) throw new Error("Could not get upload URL");
      const { uploadURL, objectPath } = await urlRes.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload failed");

      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);
      onUploaded(objectPath);
    } catch {
      setError("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Photo</label>
      <div
        className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center cursor-pointer hover:border-orange-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400">
            <ImageIcon className="w-8 h-8 mx-auto mb-1" />
            <p className="text-sm">No image</p>
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <div className="text-white text-center">
              <Upload className="w-8 h-8 mx-auto mb-1" />
              <p className="text-sm font-semibold">Tap to change photo</p>
            </div>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function ItemModal({
  mode,
  initial,
  categories,
  defaultCategoryCode,
  token,
  onSaved,
  onClose,
}: {
  mode: "edit" | "create";
  initial?: MenuItem;
  categories: Category[];
  defaultCategoryCode?: string;
  token: string;
  onSaved: (item: MenuItem) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [ingredients, setIngredients] = useState((initial?.ingredients ?? []).join("\n"));
  const [categoryCode, setCategoryCode] = useState(
    initial?.categoryCode ?? defaultCategoryCode ?? categories[0]?.code ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (mode === "create" && !code.trim()) { setError("Code is required."); return; }
    if (!name.trim()) { setError("Name is required."); return; }
    if (!categoryCode) { setError("Pick a category."); return; }

    setSaving(true);
    setError("");
    try {
      const body = {
        ...(mode === "create" ? { code: code.trim().toUpperCase(), categoryCode } : {}),
        name: name.trim(),
        price: price.trim(),
        imageUrl: imageUrl.trim() || null,
        ingredients: ingredients.split("\n").map((s) => s.trim()).filter(Boolean),
        ...(mode === "edit" ? { categoryCode } : {}),
      };
      const res = await apiFetch(
        mode === "create" ? `/api/menu/items` : `/api/menu/items/${initial!.code}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save changes.");
        return;
      }
      onSaved(await res.json());
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900">
            {mode === "create" ? "New Item" : `Edit ${initial!.code} – ${initial!.name}`}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <ImageUploader
            token={token}
            currentImageUrl={imageUrl || null}
            onUploaded={(objectPath) => {
              setImageUrl(`/api/storage/objects${objectPath.replace(/^\/objects/, "")}`);
            }}
          />
          {mode === "create" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Code (e.g. B15)</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="UNIQUE_CODE"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category</label>
            <select
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {categories.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
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
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Ingredients (one per line)</label>
            <textarea
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2 pt-1 pb-2">
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
              {saving ? "Saving..." : mode === "create" ? "Create Item" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryModal({
  mode,
  initial,
  token,
  onSaved,
  onClose,
}: {
  mode: "edit" | "create";
  initial?: Category;
  token: string;
  onSaved: (cat: Category) => void;
  onClose: () => void;
}) {
  const [code, setCode] = useState(initial?.code ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (mode === "create" && !code.trim()) { setError("Code is required."); return; }
    if (!label.trim()) { setError("Label is required."); return; }
    setSaving(true);
    setError("");
    try {
      const body = mode === "create"
        ? { code: code.trim().toLowerCase(), label: label.trim() }
        : { label: label.trim() };
      const res = await apiFetch(
        mode === "create" ? `/api/menu/categories` : `/api/menu/categories/${initial!.code}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          token,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Failed to save category.");
        return;
      }
      onSaved(await res.json());
    } catch {
      setError("Connection error.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-gray-900">
            {mode === "create" ? "New Category" : `Edit ${initial!.label}`}
          </h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          {mode === "create" && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Code</label>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm lowercase focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g. desserts"
              />
              <p className="text-xs text-gray-400 mt-1">Short identifier, no spaces. Used internally.</p>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Label (shown to customers)</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="e.g. 🍰 Desserts"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex gap-2 pt-1 pb-2">
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
              {saving ? "Saving..." : mode === "create" ? "Create Category" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ItemRow({
  item,
  categories,
  token,
  onUpdate,
  onDelete,
}: {
  item: MenuItem;
  categories: Category[];
  token: string;
  onUpdate: (updated: MenuItem) => void;
  onDelete: (code: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);
    try {
      const res = await apiFetch(`/api/menu/items/${item.code}/toggle`, {
        method: "PATCH", token,
      });
      if (res.ok) onUpdate(await res.json());
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await apiFetch(`/api/menu/items/${item.code}`, {
        method: "DELETE", token,
      });
      if (res.ok) onDelete(item.code);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className={`flex items-center gap-3 p-3 rounded-xl ${item.active ? "bg-white shadow-sm" : "bg-gray-50 opacity-50"}`}>
        {item.imageUrl ? (
          <img
            src={item.imageUrl.startsWith("/api/") ? `${API}${item.imageUrl}` : item.imageUrl}
            alt={item.name}
            className="w-14 h-14 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-lg bg-orange-100 shrink-0 flex items-center justify-center text-orange-400 text-xs font-bold">
            {item.code}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm leading-tight">{item.name}</p>
          <p className="text-orange-600 font-bold text-sm mt-0.5">{item.price}</p>
          <p className="text-gray-400 text-xs">{item.code}</p>
        </div>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => setEditing(true)}
            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
            title="Edit"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={toggle}
            disabled={busy}
            className={`p-2 rounded-lg transition-colors ${item.active ? "bg-amber-50 text-amber-600 hover:bg-amber-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}
            title={item.active ? "Hide" : "Show"}
          >
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : item.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <button
            onClick={remove}
            disabled={busy}
            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      {editing && (
        <ItemModal
          mode="edit"
          initial={item}
          categories={categories}
          token={token}
          onSaved={(updated) => { onUpdate(updated); setEditing(false); }}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  );
}

function CategorySection({
  category,
  items,
  categories,
  token,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onEditCategory,
  onDeleteCategory,
}: {
  category: Category;
  items: MenuItem[];
  categories: Category[];
  token: string;
  onUpdateItem: (updated: MenuItem) => void;
  onDeleteItem: (code: string) => void;
  onAddItem: (categoryCode: string) => void;
  onEditCategory: (cat: Category) => void;
  onDeleteCategory: (code: string) => void;
}) {
  const [open, setOpen] = useState(true);

  const removeCategory = async () => {
    if (items.length > 0) {
      alert("Move or delete the items in this category before deleting it.");
      return;
    }
    if (!confirm(`Delete category "${category.label}"?`)) return;
    onDeleteCategory(category.code);
  };

  return (
    <div className="mb-4">
      <div className="w-full flex items-center justify-between px-4 py-3 bg-orange-50 rounded-xl">
        <button onClick={() => setOpen((v) => !v)} className="flex-1 flex items-center justify-between text-left">
          <span className="font-bold text-gray-800">{category.label}</span>
          <span className="text-gray-500 text-sm flex items-center gap-1 mr-3">
            {items.length} items
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </button>
        <div className="flex gap-1.5 shrink-0">
          <button
            onClick={() => onEditCategory(category)}
            className="p-1.5 rounded-lg bg-white text-blue-600 hover:bg-blue-50 transition-colors"
            title="Rename category"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={removeCategory}
            className="p-1.5 rounded-lg bg-white text-red-500 hover:bg-red-50 transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-2 space-y-2 px-1">
          {items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              categories={categories}
              token={token}
              onUpdate={onUpdateItem}
              onDelete={onDeleteItem}
            />
          ))}
          <button
            onClick={() => onAddItem(category.code)}
            className="w-full mt-1 py-3 border-2 border-dashed border-orange-200 text-orange-500 rounded-xl text-sm font-semibold hover:bg-orange-50 hover:border-orange-300 transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-4 h-4" />
            Add item to {category.label}
          </button>
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

  const [creatingItemFor, setCreatingItemFor] = useState<string | null>(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch(`/api/menu`);
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

  const handleUpdateItem = useCallback((updated: MenuItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === updated.id);
      if (exists) return prev.map((i) => i.id === updated.id ? updated : i);
      return [...prev, updated];
    });
  }, []);

  const handleDeleteItem = useCallback(async (code: string) => {
    setItems((prev) => prev.filter((i) => i.code !== code));
  }, []);

  const handleSavedCategory = useCallback((cat: Category) => {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === cat.id);
      if (exists) return prev.map((c) => c.id === cat.id ? cat : c);
      return [...prev, cat];
    });
  }, []);

  const handleDeleteCategory = useCallback(async (code: string) => {
    const res = await apiFetch(`/api/menu/categories/${code}`, { method: "DELETE", token });
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.code !== code));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Failed to delete category.");
    }
  }, [token]);

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
        {!loading && !error && (
          <>
            <button
              onClick={() => setCreatingCategory(true)}
              className="w-full mb-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Category
            </button>
            {categories.map((cat) => (
              <CategorySection
                key={cat.id}
                category={cat}
                items={items.filter((i) => i.categoryCode === cat.code).sort((a, b) => a.displayOrder - b.displayOrder)}
                categories={categories}
                token={token}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={(code) => setCreatingItemFor(code)}
                onEditCategory={(c) => setEditingCategory(c)}
                onDeleteCategory={handleDeleteCategory}
              />
            ))}
          </>
        )}
      </main>

      {creatingItemFor !== null && (
        <ItemModal
          mode="create"
          categories={categories}
          defaultCategoryCode={creatingItemFor}
          token={token}
          onSaved={(item) => { handleUpdateItem(item); setCreatingItemFor(null); }}
          onClose={() => setCreatingItemFor(null)}
        />
      )}
      {creatingCategory && (
        <CategoryModal
          mode="create"
          token={token}
          onSaved={(cat) => { handleSavedCategory(cat); setCreatingCategory(false); }}
          onClose={() => setCreatingCategory(false)}
        />
      )}
      {editingCategory && (
        <CategoryModal
          mode="edit"
          initial={editingCategory}
          token={token}
          onSaved={(cat) => { handleSavedCategory(cat); setEditingCategory(null); }}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </div>
  );
}

export default function AuthorPage() {
  const { token, save, clear } = useToken();
  if (!token) return <LoginPage onLogin={save} />;
  return <Dashboard token={token} onLogout={clear} />;
}

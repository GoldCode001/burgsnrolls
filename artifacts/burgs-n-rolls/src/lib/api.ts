import type { MenuItem, Category } from "../data/menu";

const API = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");

interface ApiCategory {
  id: number;
  code: string;
  label: string;
  displayOrder: number;
  active: boolean;
}

interface ApiMenuItem {
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

function resolveImage(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/api/")) return `${API}${url}`;
  return url;
}

export async function fetchMenu(): Promise<{ categories: Category[]; items: MenuItem[] }> {
  const res = await fetch(`${API}/api/menu`);
  if (!res.ok) throw new Error("Failed to load menu");
  const data = (await res.json()) as { categories: ApiCategory[]; items: ApiMenuItem[] };

  const categories: Category[] = data.categories
    .filter((c) => c.active)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((c) => ({ id: c.code, label: c.label }));

  const items: MenuItem[] = data.items
    .filter((i) => i.active)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((i) => ({
      id: String(i.id),
      code: i.code,
      name: i.name,
      image: resolveImage(i.imageUrl),
      ingredients: i.ingredients ?? [],
      category: i.categoryCode,
      price: i.price,
    }));

  return { categories, items };
}

import { supabase } from "./supabase";
import type { MenuItem, Category } from "../data/menu";

export async function fetchMenu(): Promise<{ categories: Category[]; items: MenuItem[] }> {
  const { data: categoriesData, error: catError } = await supabase
    .from("categories")
    .select("*")
    .eq("active", true)
    .order("display_order");

  if (catError) throw new Error("Failed to load categories");

  const { data: itemsData, error: itemError } = await supabase
    .from("menu_items")
    .select("*")
    .eq("active", true)
    .order("display_order");

  if (itemError) throw new Error("Failed to load menu items");

  const categories: Category[] = categoriesData.map((c) => ({
    id: c.code,
    label: c.label,
  }));

  const items: MenuItem[] = itemsData.map((i) => ({
    id: String(i.id),
    code: i.code,
    name: i.name,
    image: i.image_url,
    ingredients: i.ingredients ?? [],
    category: i.category_code,
    price: i.price,
  }));

  return { categories, items };
}

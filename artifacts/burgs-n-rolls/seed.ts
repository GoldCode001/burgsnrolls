import { createClient } from "@supabase/supabase-js";
import { categories, menuItems } from "./src/data/menu";
import "dotenv/config";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // use service role key here, not anon
);

async function seed() {
  const catRows = categories.map((c, i) => ({
    code: c.id,
    label: c.label,
    display_order: i,
    active: true,
  }));
  const { error: catErr } = await supabase.from("categories").insert(catRows);
  if (catErr) console.error("categories error:", catErr);

  const itemRows = menuItems.map((item, i) => ({
    code: item.code + "-" + item.id,
    name: item.name,
    image_url: item.image,
    ingredients: item.ingredients,
    category_code: item.category,
    price: item.price,
    active: true,
    display_order: i,
  }));
  const { error: itemErr } = await supabase.from("menu_items").insert(itemRows);
  if (itemErr) console.error("menu_items error:", itemErr);

  console.log("seed complete");
}

seed();

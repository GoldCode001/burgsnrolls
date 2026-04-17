import { Router } from "express";
import { db } from "@workspace/db";
import { categoriesTable, menuItemsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/menu", async (_req, res) => {
  try {
    const categories = await db
      .select()
      .from(categoriesTable)
      .orderBy(categoriesTable.displayOrder);
    const items = await db
      .select()
      .from(menuItemsTable)
      .orderBy(menuItemsTable.displayOrder);
    res.json({ categories, items });
  } catch (err) {
    res.status(500).json({ error: "Failed to load menu" });
  }
});

router.put("/menu/items/:code", requireAuth, async (req, res) => {
  const { code } = req.params;
  const { name, price, ingredients, imageUrl } = req.body as {
    name?: string;
    price?: string;
    ingredients?: string[];
    imageUrl?: string;
  };

  try {
    const update: Record<string, unknown> = {};
    if (name !== undefined) update.name = name;
    if (price !== undefined) update.price = price;
    if (ingredients !== undefined) update.ingredients = ingredients;
    if (imageUrl !== undefined) update.imageUrl = imageUrl;

    const result = await db
      .update(menuItemsTable)
      .set(update)
      .where(eq(menuItemsTable.code, code))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});

router.patch("/menu/items/:code/toggle", requireAuth, async (req, res) => {
  const { code } = req.params;
  try {
    const current = await db
      .select()
      .from(menuItemsTable)
      .where(eq(menuItemsTable.code, code));
    if (current.length === 0) {
      res.status(404).json({ error: "Item not found" });
      return;
    }
    const result = await db
      .update(menuItemsTable)
      .set({ active: !current[0].active })
      .where(eq(menuItemsTable.code, code))
      .returning();
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to toggle item" });
  }
});

export default router;

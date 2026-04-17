import { pgTable, text, serial, boolean, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  label: text("label").notNull(),
  displayOrder: integer("display_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  ingredients: jsonb("ingredients").notNull().$type<string[]>().default([]),
  categoryCode: text("category_code").notNull(),
  price: text("price").notNull(),
  active: boolean("active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
});

export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ id: true });
export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({ id: true });

export type Category = typeof categoriesTable.$inferSelect;
export type MenuItem = typeof menuItemsTable.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;

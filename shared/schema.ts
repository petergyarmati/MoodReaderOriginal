import { pgTable, text, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const hiddenBooks = pgTable("hidden_books", {
  id: serial("id").primaryKey(),
  bookId: text("book_id").notNull(),
  mood: text("mood").notNull()
});

export const insertHiddenBookSchema = createInsertSchema(hiddenBooks).pick({
  bookId: true,
  mood: true,
});

export type InsertHiddenBook = z.infer<typeof insertHiddenBookSchema>;
export type HiddenBook = typeof hiddenBooks.$inferSelect;

export const moodSchema = z.enum([
  "Exciting",
  "Relaxing",
  "Thought-Provoking",
  "Dark",
  "Uplifting"
]);

export type Mood = z.infer<typeof moodSchema>;

import { apiRequest } from "./queryClient";
import type { InsertHiddenBook } from "@shared/schema";

export async function hideBook(book: InsertHiddenBook) {
  return apiRequest("POST", "/api/hidden-books", book);
}

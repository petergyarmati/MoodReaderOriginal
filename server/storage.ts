import { hiddenBooks, type HiddenBook, type InsertHiddenBook } from "@shared/schema";

export interface IStorage {
  getHiddenBooks(mood: string): Promise<string[]>;
  addHiddenBook(book: InsertHiddenBook): Promise<HiddenBook>;
}

export class MemStorage implements IStorage {
  private hiddenBooks: Map<number, HiddenBook>;
  private currentId: number;

  constructor() {
    this.hiddenBooks = new Map();
    this.currentId = 1;
  }

  async getHiddenBooks(mood: string): Promise<string[]> {
    return Array.from(this.hiddenBooks.values())
      .filter(book => book.mood === mood)
      .map(book => book.bookId);
  }

  async addHiddenBook(insertBook: InsertHiddenBook): Promise<HiddenBook> {
    const id = this.currentId++;
    const book: HiddenBook = { ...insertBook, id };
    this.hiddenBooks.set(id, book);
    return book;
  }
}

export const storage = new MemStorage();

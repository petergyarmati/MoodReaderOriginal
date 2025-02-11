import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHiddenBookSchema, moodSchema } from "@shared/schema";
import { z } from "zod";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

export function registerRoutes(app: Express): Server {
  app.get("/api/books/:mood", async (req, res) => {
    try {
      const mood = moodSchema.parse(req.params.mood);
      const hiddenBooks = await storage.getHiddenBooks(mood);
      
      const searchTerms = {
        Exciting: "adventure action thriller",
        Relaxing: "cozy comfort peaceful",
        "Thought-Provoking": "philosophy psychology meaning",
        Dark: "horror gothic suspense",
        Uplifting: "inspirational heartwarming positive"
      }[mood];

      const response = await fetch(
        `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(searchTerms)}&maxResults=40`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch from Google Books API");
      }

      const data = await response.json();
      const books = data.items.filter(
        (book: any) => !hiddenBooks.includes(book.id)
      );

      res.json(books);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.post("/api/hidden-books", async (req, res) => {
    try {
      const book = insertHiddenBookSchema.parse(req.body);
      const result = await storage.addHiddenBook(book);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

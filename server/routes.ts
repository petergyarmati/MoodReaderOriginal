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
      console.log(`Fetching books for mood: ${mood}`);
      const hiddenBooks = await storage.getHiddenBooks(mood);

      const searchTerms = {
        Exciting: "adventure action thriller",
        Relaxing: "cozy comfort peaceful",
        "Thought-Provoking": "philosophy psychology meaning",
        Dark: "horror gothic suspense",
        Uplifting: "inspirational heartwarming positive"
      }[mood];

      console.log(`Using search terms: ${searchTerms}`);
      const response = await fetch(
        `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(searchTerms)}&maxResults=40&printType=books&langRestrict=en&fields=items(id,volumeInfo(title,authors,description,imageLinks/thumbnail,industryIdentifiers))`,
        {
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Books API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch from Google Books API: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Retrieved ${data.items?.length ?? 0} books from Google Books API`);

      if (!data.items || !Array.isArray(data.items)) {
        console.error('Invalid response from Google Books API:', data);
        throw new Error('Invalid response from Google Books API');
      }

      const books = data.items.filter(
        (book: any) => !hiddenBooks.includes(book.id) && book.volumeInfo?.title
      );

      console.log(`Returning ${books.length} books after filtering`);
      res.json(books);
    } catch (error) {
      console.error('Error in /api/books/:mood:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid mood parameter" });
      } else {
        res.status(500).json({ message: error instanceof Error ? error.message : "Server error" });
      }
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
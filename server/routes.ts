import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHiddenBookSchema, moodSchema } from "@shared/schema";
import { z } from "zod";

const GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes";

// Enhanced mood-to-search terms mapping with weighted keywords
const moodSearchTerms = {
  Exciting: {
    primary: ["adventure", "action", "thriller"],
    secondary: ["suspense", "epic", "quest"],
    genres: ["Fantasy", "SciFi", "Mystery"]
  },
  Relaxing: {
    primary: ["cozy", "comfort", "peaceful"],
    secondary: ["gentle", "heartwarming", "calm"],
    genres: ["Literary", "Romance", "Historical"]
  },
  "Thought-Provoking": {
    primary: ["philosophy", "psychology", "meaning"],
    secondary: ["existential", "intellectual", "profound"],
    genres: ["Literary", "SciFi", "Historical"]
  },
  Dark: {
    primary: ["horror", "gothic", "suspense"],
    secondary: ["psychological", "mystery", "tension"],
    genres: ["Mystery", "Fantasy", "Literary"]
  },
  Uplifting: {
    primary: ["inspirational", "heartwarming", "positive"],
    secondary: ["hopeful", "growth", "triumph"],
    genres: ["Romance", "Literary", "Historical"]
  }
};

// Helper function to generate weighted search query
function generateSearchQuery(mood: keyof typeof moodSearchTerms) {
  const terms = moodSearchTerms[mood];
  const primaryQuery = terms.primary.join(" ");
  const secondaryQuery = terms.secondary.map(term => `OR "${term}"`).join(" ");
  return `${primaryQuery} ${secondaryQuery}`;
}

// Helper function to score book relevance
function scoreBook(book: any, mood: keyof typeof moodSearchTerms): number {
  let score = 0;
  const terms = moodSearchTerms[mood];
  const description = (book.volumeInfo.description || "").toLowerCase();
  const title = (book.volumeInfo.title || "").toLowerCase();

  // Score based on primary keywords (higher weight)
  terms.primary.forEach(term => {
    if (description.includes(term.toLowerCase())) score += 2;
    if (title.includes(term.toLowerCase())) score += 3;
  });

  // Score based on secondary keywords (lower weight)
  terms.secondary.forEach(term => {
    if (description.includes(term.toLowerCase())) score += 1;
    if (title.includes(term.toLowerCase())) score += 1.5;
  });

  // Bonus points for high ratings and review counts
  if (book.volumeInfo.averageRating) {
    score += book.volumeInfo.averageRating;
  }

  return score;
}

export function registerRoutes(app: Express): Server {
  app.get("/api/books/:mood", async (req, res) => {
    try {
      const mood = moodSchema.parse(req.params.mood);
      console.log(`Fetching books for mood: ${mood}`);
      const hiddenBooks = await storage.getHiddenBooks(mood);

      const searchQuery = generateSearchQuery(mood);
      console.log(`Generated search query: ${searchQuery}`);

      const apiUrl = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(searchQuery)}&maxResults=40&printType=books&langRestrict=en&fields=items(id,volumeInfo(title,authors,description,imageLinks/thumbnail,industryIdentifiers,averageRating,ratingsCount))`;
      console.log(`Making request to Google Books API: ${apiUrl}`);

      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Google Books API error: ${response.status} - ${errorText}`);
        throw new Error(`Failed to fetch from Google Books API: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Retrieved ${data.items?.length ?? 0} books from Google Books API`);

      if (!data.items || !Array.isArray(data.items)) {
        console.error('Invalid response from Google Books API:', JSON.stringify(data));
        throw new Error('Invalid response from Google Books API');
      }

      // Filter and score books
      const books = data.items
        .filter(book => 
          !hiddenBooks.includes(book.id) && 
          book.volumeInfo?.title &&
          book.volumeInfo?.description
        )
        .map(book => ({
          ...book,
          relevanceScore: scoreBook(book, mood)
        }))
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 20); // Return top 20 most relevant books

      console.log(`Returning ${books.length} books after filtering and scoring`);
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
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid request body" });
      } else {
        res.status(500).json({ message: "Server error" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
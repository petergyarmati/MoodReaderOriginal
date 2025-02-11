import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import BookCard from "@/components/book-card";
import { hideBook } from "@/lib/api";
import { ChevronLeft, ChevronRight, Edit2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { Mood } from "@shared/schema";

interface Book {
  id: string;
  relevanceScore: number;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail: string;
    };
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    averageRating?: number;
    ratingsCount?: number;
  };
}

export default function Recommendations() {
  const { mood } = useParams<{ mood: Mood }>();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  const { data: books = [], isLoading, error } = useQuery<Book[]>({
    queryKey: [`/api/books/${mood}`],
    enabled: !!mood,
  });

  useEffect(() => {
    if (!mood) {
      setLocation("/");
    }
  }, [mood]); 

  useEffect(() => {
    if (error) {
      toast({
        title: "Error loading books",
        description: "Failed to load book recommendations. Please try again.",
        variant: "destructive"
      });
      console.error("Book loading error:", error);
    }
  }, [error, toast]);

  const handleHide = async (bookId: string) => {
    if (!mood) return;
    try {
      await hideBook({ bookId, mood });
      await queryClient.invalidateQueries({ queryKey: [`/api/books/${mood}`] });
      toast({ title: "Book hidden from future recommendations" });
    } catch (error) {
      toast({ 
        title: "Failed to hide book",
        variant: "destructive"
      });
    }
  };

  const currentBook = books[currentIndex];
  const totalBooks = books.length;

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{mood} Books</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Showing {currentIndex + 1} of {totalBooks} recommendations
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/")}
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Change Mood
          </Button>
        </div>

        {isLoading ? (
          <Card className="w-full h-[400px] animate-pulse" />
        ) : books.length ? (
          <>
            <BookCard
              book={currentBook}
              onHide={() => handleHide(currentBook.id)}
              relevanceScore={currentBook.relevanceScore}
            />
            <div className="flex justify-center gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={() => setCurrentIndex(i => Math.min(books.length - 1, i + 1))}
                disabled={currentIndex === books.length - 1}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <Card className="p-6 text-center">
            <p>No more recommendations available for this mood.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
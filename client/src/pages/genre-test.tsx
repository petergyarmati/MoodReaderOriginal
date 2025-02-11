import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GenreQuiz from "@/components/genre-quiz";
import { Book } from "lucide-react";

type Genre = "Fantasy" | "Mystery" | "Literary" | "SciFi" | "Romance" | "Historical";

const genreDescriptions = {
  Fantasy: "You enjoy rich world-building, magic, and epic adventures.",
  Mystery: "You love solving puzzles and uncovering secrets.",
  Literary: "You appreciate deep character studies and thought-provoking themes.",
  SciFi: "You're drawn to futuristic concepts and technological speculation.",
  Romance: "You value emotional depth and relationship dynamics.",
  Historical: "You're fascinated by different time periods and cultural contexts."
};

export default function GenreTest() {
  const [_, setLocation] = useLocation();
  const [completedGenres, setCompletedGenres] = useState<Genre[] | null>(null);

  const handleComplete = (genres: Genre[]) => {
    setCompletedGenres(genres);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="pt-6">
          {!completedGenres ? (
            <>
              <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Discover Your Perfect Book Genres
              </h1>
              <GenreQuiz onComplete={handleComplete} />
            </>
          ) : (
            <div className="space-y-6">
              <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Your Reading Profile
              </h1>
              <div className="space-y-4">
                {completedGenres.map((genre, index) => (
                  <div key={genre} className="p-4 border rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">
                      {index + 1}. {genre}
                    </h3>
                    <p className="text-muted-foreground">
                      {genreDescriptions[genre]}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Button onClick={() => setLocation("/")}>
                  <Book className="mr-2 h-4 w-4" />
                  Find Books
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

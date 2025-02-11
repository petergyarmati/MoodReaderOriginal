import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Genre = "Fantasy" | "Mystery" | "Literary" | "SciFi" | "Romance" | "Historical";

interface GenreScore {
  Fantasy: number;
  Mystery: number;
  Literary: number;
  SciFi: number;
  Romance: number;
  Historical: number;
}

const questions = [
  {
    text: "How do you prefer to spend your free time?",
    options: [
      { text: "Exploring new worlds through imagination", genres: ["Fantasy", "SciFi"] },
      { text: "Solving puzzles and riddles", genres: ["Mystery"] },
      { text: "Reflecting on life and relationships", genres: ["Literary", "Romance"] },
      { text: "Learning about different time periods", genres: ["Historical"] }
    ]
  },
  {
    text: "What elements draw you most into a story?",
    options: [
      { text: "Complex world-building and magic systems", genres: ["Fantasy", "SciFi"] },
      { text: "Intricate plots and unexpected twists", genres: ["Mystery"] },
      { text: "Deep character development", genres: ["Literary", "Romance"] },
      { text: "Rich historical details and settings", genres: ["Historical"] }
    ]
  },
  {
    text: "What kind of protagonist do you relate to most?",
    options: [
      { text: "A hero on an epic journey", genres: ["Fantasy"] },
      { text: "A clever detective or investigator", genres: ["Mystery"] },
      { text: "Someone dealing with personal growth", genres: ["Literary"] },
      { text: "A visionary exploring new frontiers", genres: ["SciFi"] }
    ]
  },
  {
    text: "What themes interest you the most?",
    options: [
      { text: "Good vs. Evil", genres: ["Fantasy", "SciFi"] },
      { text: "Truth and Justice", genres: ["Mystery"] },
      { text: "Love and Relationships", genres: ["Romance", "Literary"] },
      { text: "Power and Society", genres: ["Historical"] }
    ]
  },
  {
    text: "What's your ideal story pace?",
    options: [
      { text: "Fast-paced with lots of action", genres: ["Fantasy", "SciFi"] },
      { text: "Steady with building suspense", genres: ["Mystery"] },
      { text: "Thoughtful and contemplative", genres: ["Literary"] },
      { text: "Rich with detail and atmosphere", genres: ["Historical", "Romance"] }
    ]
  }
];

interface GenreQuizProps {
  onComplete: (genres: Genre[]) => void;
}

export default function GenreQuiz({ onComplete }: GenreQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [genreScores, setGenreScores] = useState<GenreScore>({
    Fantasy: 0,
    Mystery: 0,
    Literary: 0,
    SciFi: 0,
    Romance: 0,
    Historical: 0
  });

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (selectedGenres: Genre[]) => {
    const newScores = { ...genreScores };
    selectedGenres.forEach(genre => {
      newScores[genre] += 1;
    });
    setGenreScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      // Find top 3 genres
      const sortedGenres = Object.entries(newScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([genre]) => genre as Genre);
      
      onComplete(sortedGenres);
    }
  };

  const question = questions[currentQuestion];

  return (
    <div className="space-y-6">
      <Progress value={progress} className="w-full" />
      <h2 className="text-2xl font-semibold text-center mb-6">
        {question.text}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question.options.map((option, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-auto py-6 text-lg"
            onClick={() => handleAnswer(option.genres as Genre[])}
          >
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
}

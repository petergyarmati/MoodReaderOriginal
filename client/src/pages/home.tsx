import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MoodButton from "@/components/mood-button";
import MoodQuiz from "@/components/mood-quiz";
import type { Mood } from "@shared/schema";
import { HelpCircle, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [_, setLocation] = useLocation();
  const [showQuiz, setShowQuiz] = useState(false);

  const moods: Mood[] = [
    "Exciting",
    "Relaxing",
    "Thought-Provoking",
    "Dark",
    "Uplifting"
  ];

  const handleMoodSelected = (mood: Mood) => {
    setLocation(`/recommendations/${mood}`);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="pt-6">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {showQuiz ? "Let's Find Your Reading Mood" : "How are you feeling today?"}
          </h1>

          {showQuiz ? (
            <MoodQuiz onMoodSelected={handleMoodSelected} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moods.map((mood) => (
                  <MoodButton
                    key={mood}
                    mood={mood}
                    onClick={() => handleMoodSelected(mood)}
                  />
                ))}
              </div>
              <div className="mt-8 flex flex-col items-center gap-4">
                <Button 
                  variant="ghost" 
                  onClick={() => setShowQuiz(true)}
                  className="text-muted-foreground"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Not sure? Take a quick quiz
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setLocation("/genre-test")}
                  className="text-muted-foreground"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Discover your perfect book genres
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
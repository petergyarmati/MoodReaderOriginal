import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import MoodButton from "@/components/mood-button";
import type { Mood } from "@shared/schema";

export default function Home() {
  const [_, setLocation] = useLocation();
  const moods: Mood[] = [
    "Exciting",
    "Relaxing",
    "Thought-Provoking",
    "Dark",
    "Uplifting"
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="pt-6">
          <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            How are you feeling today?
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {moods.map((mood) => (
              <MoodButton
                key={mood}
                mood={mood}
                onClick={() => setLocation(`/recommendations/${mood}`)}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
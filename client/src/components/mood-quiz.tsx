import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Mood } from "@shared/schema";

const questions = [
  {
    text: "How is your energy level right now?",
    options: [
      { text: "Very energetic", moods: ["Exciting"] },
      { text: "Calm and peaceful", moods: ["Relaxing"] },
      { text: "Mentally active", moods: ["Thought-Provoking"] },
      { text: "Low and introspective", moods: ["Dark"] },
      { text: "Positive and bright", moods: ["Uplifting"] }
    ]
  },
  {
    text: "What are you looking to get from your reading session?",
    options: [
      { text: "An adrenaline rush", moods: ["Exciting"] },
      { text: "Peace and comfort", moods: ["Relaxing", "Uplifting"] },
      { text: "New perspectives", moods: ["Thought-Provoking"] },
      { text: "Explore complex emotions", moods: ["Dark"] }
    ]
  },
  {
    text: "What's your current environment like?",
    options: [
      { text: "Busy and stimulating", moods: ["Exciting", "Thought-Provoking"] },
      { text: "Quiet and cozy", moods: ["Relaxing", "Dark"] },
      { text: "Bright and cheerful", moods: ["Uplifting"] },
      { text: "Peaceful and contemplative", moods: ["Thought-Provoking", "Relaxing"] }
    ]
  }
];

interface MoodQuizProps {
  onMoodSelected: (mood: Mood) => void;
}

export default function MoodQuiz({ onMoodSelected }: MoodQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [moodScores, setMoodScores] = useState<Record<Mood, number>>({
    Exciting: 0,
    Relaxing: 0,
    "Thought-Provoking": 0,
    Dark: 0,
    Uplifting: 0
  });

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (selectedMoods: Mood[]) => {
    const newScores = { ...moodScores };
    selectedMoods.forEach(mood => {
      newScores[mood] += 1;
    });
    setMoodScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(curr => curr + 1);
    } else {
      // Find the mood with the highest score
      const topMood = Object.entries(newScores).reduce((a, b) => 
        b[1] > a[1] ? b : a
      )[0] as Mood;
      onMoodSelected(topMood);
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
            onClick={() => handleAnswer(option.moods as Mood[])}
          >
            {option.text}
          </Button>
        ))}
      </div>
    </div>
  );
}

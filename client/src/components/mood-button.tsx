import { Button } from "@/components/ui/button";
import type { Mood } from "@shared/schema";
import { 
  Flame, 
  Coffee, 
  Brain, 
  Moon, 
  Sun
} from "lucide-react";

const moodIcons = {
  "Exciting": Flame,
  "Relaxing": Coffee,
  "Thought-Provoking": Brain,
  "Dark": Moon,
  "Uplifting": Sun
};

interface MoodButtonProps {
  mood: Mood;
  onClick: () => void;
}

export default function MoodButton({ mood, onClick }: MoodButtonProps) {
  const Icon = moodIcons[mood];
  
  return (
    <Button
      variant="outline"
      size="lg"
      className="h-24 text-lg flex flex-col gap-2"
      onClick={onClick}
    >
      <Icon className="h-6 w-6" />
      {mood}
    </Button>
  );
}

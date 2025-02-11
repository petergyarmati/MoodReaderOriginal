import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EyeOff } from "lucide-react";
import { SiAmazon, SiBookstack } from "react-icons/si";
import { Progress } from "@/components/ui/progress";

interface BookCardProps {
  book: any;
  onHide: () => void;
  relevanceScore: number;
}

export default function BookCard({ book, onHide, relevanceScore }: BookCardProps) {
  const volumeInfo = book.volumeInfo;
  const thumbnail = volumeInfo.imageLinks?.thumbnail;
  const normalizedScore = Math.min(100, Math.round((relevanceScore / 10) * 100));

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-[200px,1fr] gap-6">
          {thumbnail && (
            <div className="aspect-[2/3] bg-muted">
              <img
                src={thumbnail.replace('http:', 'https:')}
                alt={volumeInfo.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold mb-2">{volumeInfo.title}</h2>
            <p className="text-muted-foreground mb-4">
              By {volumeInfo.authors?.join(", ") || "Unknown Author"}
            </p>
            <div className="space-y-4 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Match Score</span>
                  <span className="text-sm font-medium">{normalizedScore}%</span>
                </div>
                <Progress value={normalizedScore} className="h-2" />
              </div>
              {volumeInfo.averageRating && (
                <p className="text-sm text-muted-foreground">
                  Rating: {volumeInfo.averageRating}/5
                  {volumeInfo.ratingsCount && ` (${volumeInfo.ratingsCount} ratings)`}
                </p>
              )}
            </div>
            <p className="text-sm line-clamp-4">
              {volumeInfo.description || "No description available."}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-4 flex-wrap">
        <Button variant="outline" onClick={onHide}>
          <EyeOff className="mr-2 h-4 w-4" />
          Hide
        </Button>
        <div className="flex gap-2">
          {volumeInfo.industryIdentifiers?.map((id: any) => (
            <Button
              key={id.identifier}
              variant="outline"
              asChild
            >
              <a
                href={`https://amazon.com/s?k=${id.identifier}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiAmazon className="mr-2 h-4 w-4" />
                Amazon
              </a>
            </Button>
          ))}
          <Button
            variant="outline"
            asChild
          >
            <a
              href={`https://bookshop.org/search?keywords=${encodeURIComponent(volumeInfo.title)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SiBookstack className="mr-2 h-4 w-4" />
              Bookshop
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
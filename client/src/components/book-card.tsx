import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ShoppingCart } from "lucide-react";
import { SiAmazon, SiBookstack } from "react-icons/si";

interface BookCardProps {
  book: any;
  onHide: () => void;
}

export default function BookCard({ book, onHide }: BookCardProps) {
  const volumeInfo = book.volumeInfo;
  const thumbnail = volumeInfo.imageLinks?.thumbnail;
  
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
            <p className="text-sm line-clamp-4 mb-4">
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

import { Star } from "lucide-react";

type RatingProps = {
  rating: number; // Example: 4.5
  reviews: number; // Example: 120
};

export default function Rating({ rating, reviews }: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const totalStars = 5;

  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 opacity-50" />
        )}
        {[...Array(totalStars - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={i + fullStars + 1} className="h-4 w-4 text-gray-300" />
        ))}
      </div>
      <p className="text-sm font-medium text-gray-900 dark:text-white">
        {rating.toFixed(1)}
      </p>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {reviews ? `(${reviews})`:null}
      </p>
    </div>
  );
}

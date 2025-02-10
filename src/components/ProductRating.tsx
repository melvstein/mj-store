
import { TProductRating } from '@/types';
import { FaStar, FaRegStar, FaStarHalfAlt  } from "react-icons/fa";

const ProductRating: React.FC<TProductRating> = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStars = rating % 1 !== 0 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className='flex items-center justify-center space-x-2'>
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={`full-${index}`} />
      ))}
      {[...Array(halfStars)].map((_, index) => (
        <FaStarHalfAlt key={`half-${index}`} />
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={`empty-${index}`} />
      ))}
    </div>
  );
};

export default ProductRating;
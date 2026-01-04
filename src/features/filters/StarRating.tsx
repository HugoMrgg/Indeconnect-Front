import React from 'react';
import { useTranslation } from 'react-i18next';

interface StarRatingProps {
    rating: number | undefined; // 0-5
    onRatingChange: (rating: number) => void;
    maxStars?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
                                                          rating = 0,
                                                          onRatingChange,
                                                          maxStars = 5
                                                      }) => {
    const { t } = useTranslation();
    const [hoveredStar, setHoveredStar] = React.useState<number | null>(null);

    const handleClick = (starIndex: number) => {
        // Si on clique sur la même étoile, on désélectionne (rating = 0)
        if (rating === starIndex) {
            onRatingChange(0);
        } else {
            onRatingChange(starIndex);
        }
    };

    const renderStar = (index: number) => {
        const isFilled = index <= (hoveredStar ?? rating);

        return (
            <button
                key={index}
                type="button"
                onClick={() => handleClick(index)}
                onMouseEnter={() => setHoveredStar(index)}
                onMouseLeave={() => setHoveredStar(null)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={t('star_rating.aria_label', { count: index })}
            >
                <svg
                    className={`w-8 h-8 transition-colors ${
                        isFilled
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-none text-gray-300'
                    }`}
                    stroke="currentColor"
                    strokeWidth="1"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                </svg>
            </button>
        );
    };

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: maxStars }, (_, i) => renderStar(i + 1))}
            {rating > 0 && (
                <span className="ml-2 text-sm text-gray-600">
                    {t('star_rating.minimum', { count: rating })}
                </span>
            )}
        </div>
    );
};

import { FC, useState } from 'react';

const StarRating: FC<{
  onValueChange?: (newVal: number) => any;
  totalStars?: number;
  disabled?: boolean;
  initialRating?: number;
}> = ({ totalStars = 5, onValueChange, disabled, initialRating }) => {
  const [starsSelected, setStarsSelected] = useState(initialRating || 0);

  const change = (starsSelected: number) => {
    setStarsSelected(starsSelected);
    onValueChange && onValueChange(starsSelected);
  };

  const Star = ({ selected = false, onClick = (f: any) => f }) => <div className={selected ? 'star selected' : 'star'} onClick={onClick}></div>;

  return (
    <>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((n, i) => (
          <Star key={i} selected={i < starsSelected} onClick={() => !disabled && change(i + 1)} />
        ))}
      </div>
      <div className="row m-2 ps-2 txt-grey">
        {starsSelected} of {totalStars} stars
      </div>
    </>
  );
};

export default StarRating;

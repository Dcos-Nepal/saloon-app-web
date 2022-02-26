import { FC, useState } from 'react';

const StarRating: FC<{
  onValueChange: (newVal: number) => any;
  totalStars?: number;
}> = ({ totalStars = 5, onValueChange }) => {
  const [starsSelected, setStarsSelected] = useState(0);

  const change = (starsSelected: number) => {
    setStarsSelected(starsSelected);
    onValueChange(starsSelected);
  };

  const Star = ({ selected = false, onClick = (f: any) => f }) => <div className={selected ? 'star selected' : 'star'} onClick={onClick}></div>;

  return (
    <>
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((n, i) => (
          <Star key={i} selected={i < starsSelected} onClick={() => change(i + 1)} />
        ))}
      </div>
      <div className="row m-2 ps-2 txt-grey">
        {starsSelected} of {totalStars} stars
      </div>
    </>
  );
};

export default StarRating;

import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const LottieWrapper = ({ src, ...props }) => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(src)
      .then(res => res.json())
      .then(setAnimationData)
      .catch(console.error);
  }, [src]);

  if (!animationData) return null;

  return <Lottie animationData={animationData} {...props} />;
};

export default LottieWrapper;

import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LottieComponent = ({ src, maxWidth = '600px', maxHeight = 'auto' }) => {
  return (
    <div
      className="lottie-wrapper"
      style={{
        width: '100%',
        maxWidth,
        maxHeight,
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <DotLottieReact src={src} loop autoplay style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default LottieComponent;

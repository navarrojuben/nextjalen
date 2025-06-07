import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';


const SkeletonLoader = ({ type }) => {
  switch (type) {
    case 'card':
      return (
        <Stack spacing={1} className="skeletonItem card">
          <Skeleton variant="text"        width="300px" />
          <Skeleton variant="rectangular" width={300} height={300} />
          <Skeleton variant="text"        width="300px" />
          <Skeleton variant="text"        width="300px" />
        </Stack>
      );

    case 'list':
      return (
        <Stack spacing={1} className="skeletonItem skeleton-list">
          {Array(5).fill().map((_, i) => (
            <Skeleton key={i} variant="text" width="100%" height={30} />
          ))}
        </Stack>
      );

    case 'profile':
      return (
        <Stack direction="row" spacing={2} alignItems="center" className="skeletonItem skeleton-profile">
          <Skeleton variant="circular" width={50} height={50} />
          <Stack spacing={0.5}>
            <Skeleton variant="text" width={100} />
            <Skeleton variant="text" width={150} />
          </Stack>
        </Stack>
      );

    default:
      return <Skeleton variant="text" width="100%" />;
  }
};


export default SkeletonLoader;

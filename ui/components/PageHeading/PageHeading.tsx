import { PageHeadingBox } from '@/styles/StyledComponents/PageHeadingStyled';
import { Typography } from '@mui/material';
import React from 'react';

interface IPageHeadingProps {
  title: string;
  suTitle: string | string[];
  alignItem?: 'center' | 'left';
  className?: string;
}

const PageHeading: React.FC<IPageHeadingProps> = ({ title, suTitle, alignItem, className }) => {
  return (
    <PageHeadingBox alignItem={alignItem} className={className}>
      <Typography variant='h2'>{title}</Typography>
      {Array.isArray(suTitle) ? (
        suTitle.map((text, index) => (
          <Typography variant='body2' key={index}>
            {text}
          </Typography>
        ))
      ) : (
        <Typography variant='body2'>{suTitle}</Typography>
      )}
    </PageHeadingBox>
  );
};

export default PageHeading;

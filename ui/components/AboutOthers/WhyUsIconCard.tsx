import { WhyUsCard } from '@/styles/StyledComponents/WhyUsStyled';
import { Typography } from '@mui/material';
import React from 'react';

interface WhyUsCardPros {
  cardIcon: React.ReactNode | React.ReactElement;
  cardHead: string;
  cardPara: string;
}

const WhyUsIconCard: React.FC<WhyUsCardPros> = ({ cardIcon, cardHead, cardPara }) => {
  return (
    <WhyUsCard className='whyus-card'>
      <i>{cardIcon}</i>
      <Typography variant='h3' textTransform={'capitalize'}>
        {cardHead}
      </Typography>
      <Typography variant='body2'>{cardPara}</Typography>
    </WhyUsCard>
  );
};

export default WhyUsIconCard;

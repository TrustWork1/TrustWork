import { OurFeatureCardWrapper } from '@/styles/StyledComponents/OurFeatureCardWrapper';
import { Typography } from '@mui/material';

interface IFeatureCardsDetails {
  icon: React.ReactElement;
  cardTitle: string;
  cardDes: string;
}

export const OurFeatureCard = ({ icon, cardTitle, cardDes }: IFeatureCardsDetails) => {
  return (
    <OurFeatureCardWrapper elevation={0}>
      <i>{icon}</i>
      <Typography variant='h3'>{cardTitle}</Typography>
      <Typography variant='body1'>{cardDes}</Typography>
    </OurFeatureCardWrapper>
  );
};

import { WorkCardWrapper } from '@/styles/StyledComponents/WorkCardWrapper';
import { Box, Stack, Typography } from '@mui/material';

interface IWorkCardsDetails {
  icon: React.ReactElement;
  cardTitle: string;
  cardDes: string;
  indexValue: number;
}

export const WorkCard = ({ icon, cardTitle, cardDes, indexValue }: IWorkCardsDetails) => {
  return (
    <WorkCardWrapper direction='row' alignItems='center' justifyContent='space-between'>
      <Stack direction='row' alignItems='center' className='inner_left'>
        <i>{icon}</i>
        <Box className='card_details_box'>
          <Typography variant='h3'>{cardTitle}</Typography>
          <Typography variant='body1'>{cardDes}</Typography>
        </Box>
      </Stack>
      <Typography variant='h4'>0{indexValue + 1}</Typography>
    </WorkCardWrapper>
  );
};

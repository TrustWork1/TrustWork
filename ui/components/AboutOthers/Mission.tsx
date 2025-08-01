import assest from '@/json/assest';
import { MissionWrapper } from '@/styles/StyledComponents/MissionStyled';
import { Box, Container, Grid2 } from '@mui/material';
import Image from 'next/image';
import MissionCard from './MissionCard';

const Mission = () => {
  interface IMissionItem {
    title: string;
    description: string;
  }

  const missonContent: IMissionItem[] = [
    {
      title: 'Our Mission',
      description:
        'Lorem ipsum dolor sit amet consectetur. Non nibh sapien sed nulla ultricies. Tincidunt leo malesuada libero odio lacinia non metus quam blandit. Sed nisi turpis tellus ut blandit quis amet urna. Dignissim nisl iaculis aliquam sodales. Bibendum enim ac fermentum nullam sit.',
    },

    {
      title: 'Our Vision',
      description:
        'Lorem ipsum dolor sit amet consectetur. Non nibh sapien sed nulla ultricies. Tincidunt leo malesuada libero odio lacinia non metus quam blandit. Sed nisi turpis tellus ut blandit quis amet urna. Dignissim nisl iaculis aliquam sodales. Bibendum enim ac fermentum nullam sit.',
    },
  ];

  return (
    <MissionWrapper>
      <Container fixed>
        <Grid2 container alignItems={'center'}>
          <Grid2 size={{ md: 6, sm: 12 }}>
            <Box className='mission-immage-wrap'>
              <Image src={assest.missionImage} width={811} height={811} alt='mission-image' />
            </Box>
          </Grid2>
          <Grid2 size={{ md: 6, sm: 12 }}>
            {missonContent.map((item: IMissionItem, index: number) => (
              <MissionCard key={index} title={item?.title} description={item?.description} />
            ))}
          </Grid2>
        </Grid2>
      </Container>
    </MissionWrapper>
  );
};

export default Mission;

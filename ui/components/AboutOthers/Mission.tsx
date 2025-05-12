import assest from '@/json/assest';
import { MissionWrapper } from '@/styles/StyledComponents/MissionStyled';
import { IAboutModel } from '@/typescript/interface/aboutUs.interfaces';
import { Box, Container, Grid2 } from '@mui/material';
import Image from 'next/image';
import MissionCard from './MissionCard';

const Mission = ({ missionInfo }: { missionInfo: IAboutModel['AboutUsOtherDetails'] }) => {
  interface IMissionItem {
    title: string;
    description: string;
  }

  const missonContent = [
    {
      title: missionInfo?.mission_title,
      description: missionInfo?.mission_description,
    },
    {
      title: missionInfo?.vision_title,
      description: missionInfo?.vision_description,
    },
  ];
  

  return (
    <MissionWrapper>
      <Container fixed>
        <Grid2 container alignItems={'center'}>
          <Grid2 size={{ md: 6, sm: 12 }}>
            <Box className='mission-immage-wrap'>
              <Image
                src={missionInfo?.image || assest.missionImage}
                width={811}
                height={811}
                alt='mission-image'
              />
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

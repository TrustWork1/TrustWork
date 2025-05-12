import { MissonCardWrap } from '@/styles/StyledComponents/MissonCardStyled';
import { BoxProps, Typography } from '@mui/material';

interface IMissionCardProps extends BoxProps {
  title: string;
  description: string;
}

const MissionCard: React.FC<IMissionCardProps> = ({ title, description }) => {
  return (
    <MissonCardWrap>
      <Typography variant='h2'>{title}</Typography>
      <Typography variant='body2'>{description}</Typography>
    </MissonCardWrap>
  );
};

export default MissionCard;

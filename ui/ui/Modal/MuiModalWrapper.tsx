import { borderRadius } from '@/mui-theme/themeConstant';
import { CustomDialog } from '@/styles/StyledComponents/CustomDialog';
import { Box, IconButton, Typography } from '@mui/material';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloseIcon from '../Icon/CloseIcon';

interface MuiModalWrapperProps {
  open: boolean;
  onClose?: () => void;
  scroll?: 'paper' | 'body';
  children: React.JSX.Element | React.JSX.Element[];
  title?: string;
  subTitle?: string;
  isModalHead?: boolean;
  className?: string;
}

export default function MuiModalWrapper({
  open,
  onClose,
  scroll,
  children,
  isModalHead,
  title,
  subTitle,
  className,
}: MuiModalWrapperProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <CustomDialog
      fullScreen={fullScreen}
      open={open}
      onClose={onClose}
      scroll={scroll}
      aria-labelledby='responsive-dialog-title'
      PaperProps={{
        style: {
          borderRadius,
        },
      }}
      className={className}
    >
      <IconButton onClick={onClose} className='dialog-close-btn'>
        <CloseIcon IconColor='currentcolor' />
      </IconButton>

      <DialogContent>
        {isModalHead && (
          <Box className='modalHead'>
            <Typography variant='h4'>{title}</Typography>
            <Typography variant='body1' className='subTitle'>
              {subTitle}
            </Typography>
          </Box>
        )}

        {children}
      </DialogContent>
    </CustomDialog>
  );
}

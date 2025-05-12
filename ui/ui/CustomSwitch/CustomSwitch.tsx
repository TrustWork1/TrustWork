import styled from '@emotion/styled';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';

export const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName='.Mui-focusVisible' disableRipple {...props} />
))({
  width: 66,
  height: 36,
  padding: 0,
  borderRadius: 50,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 3,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(31px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      border: '6px solid #fff',
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 30,
    height: 30,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,

    // transition: theme.transitions.create(['background-color'], {
    //   duration: 500,
    // }),
  },
});

interface props extends SwitchProps {
  label?: string;
}

export default function CustomSwitch({ label, ...others }: props) {
  return <FormControlLabel control={<IOSSwitch sx={{ m: 1 }} {...others} />} label={label} />;
}

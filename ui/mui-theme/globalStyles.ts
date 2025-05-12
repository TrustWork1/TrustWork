// ** MUI Imports
import { Theme } from '@mui/material/styles';

const GlobalStyling = (_theme: Theme) => ({
  '.main_body': {
    minHeight: 'calc(100vh - 96px)',
  },

  img: {
    maxWidth: '100%',
    height: 'auto',
  },
  a: {
    display: 'inline-block',
    textDecoration: 'none',
  },

  'p:last-child': {
    marginBottom: 0,
  },
  ul: {
    padding: 0,
    margin: 0,
    listStyle: 'none',
  },
  '.MuiContainer-root': {
    padding: '0 30px !important',

    '@media (max-width: 599px)': {
      padding: '0 15px !important',
    },
  },

  // Additional styles here
});

export default GlobalStyling;

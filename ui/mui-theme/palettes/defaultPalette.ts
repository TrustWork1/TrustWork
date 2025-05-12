// ** Type Imports
import { Palette } from '@mui/material';

export const defaultPalette = (mode: Palette['mode']): Palette => {
  // ** Vars
  const whiteColor = '#FFFFFF';
  const lightColor = '#111610'; // Hex equivalent of '47, 43, 61'
  const darkColor = '#494949'; // Hex equivalent of '208, 212, 241'
  const darkPaperBgColor = '#2F3349';
  const mainColor = mode === 'light' ? darkColor : darkColor;
  const defaultBgColor = whiteColor;
  const CustomPrimary = '#4B991E';

  // Convert RGBA to Hex with opacity
  const hexWithOpacity = (hex: string, opacity: number) => {
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, '0');

    return `${hex}${alpha}`;
  };

  return {
    customColors: {
      dark: darkColor,
      main: mainColor,
      light: lightColor,
      lightPaperBg: whiteColor,
      darkPaperBg: darkPaperBgColor,
      bodyBg: mode === 'light' ? '#F8F7FA' : '#25293C', // Same as palette.background.default but doesn't consider bordered skin
      trackBg: mode === 'light' ? '#F1F0F2' : '#363B54',
      avatarBg: mode === 'light' ? '#DBDADE' : '#4A5072',
      tableHeaderBg: mode === 'light' ? '#F6F6F7' : '#4A5072',
      placeText: '#576E6E',
      white600: hexWithOpacity(whiteColor, 0.6),
      primary100: hexWithOpacity(CustomPrimary, 0.1),
      downloadAppBG: '#EEF6EA',
      maskBorder: '#F5FFEF',
      borderColor: '#EFF1EE',
    },
    mode: mode,
    common: {
      black: '#000000',
      white: whiteColor,
    },
    primary: {
      light: '#EEF6EA',
      main: '#4B991E',
      dark: '#655BD3',
      contrastText: whiteColor,
    },
    secondary: {
      light: '#B2B4B8',
      main: '#DFFF00',
      dark: '#C0F060',
      contrastText: whiteColor,
    },
    error: {
      light: '#ED6F70',
      main: '#EA5455',
      dark: '#CE4A4B',
      contrastText: whiteColor,
    },
    warning: {
      light: '#FFAB5A',
      main: '#FF9F43',
      dark: '#E08C3B',
      contrastText: whiteColor,
    },
    info: {
      light: '#1FD5EB',
      main: '#00CFE8',
      dark: '#00B6CC',
      contrastText: whiteColor,
    },
    success: {
      light: '#42CE80',
      main: '#28C76F',
      dark: '#23AF62',
      contrastText: whiteColor,
    },
    grey: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EDEFEA',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      A100: '#F5F5F5',
      A200: '#EEEEEE',
      A400: '#BDBDBD',
      A700: '#616161',
    },
    text: {
      primary: mainColor,
      secondary: lightColor,
      disabled: hexWithOpacity(mainColor, 0.42),
    },
    divider: hexWithOpacity(mainColor, 0.16),
    background: {
      paper: mode === 'light' ? whiteColor : darkPaperBgColor,
      default: defaultBgColor,
    },
    action: {
      active: hexWithOpacity(mainColor, 0.54),
      hover: hexWithOpacity(mainColor, 0.04),
      selected: hexWithOpacity(mainColor, 0.06),
      selectedOpacity: 0.06,
      disabled: hexWithOpacity(mainColor, 0.26),
      disabledBackground: hexWithOpacity(mainColor, 0.12),
      focus: hexWithOpacity(mainColor, 0.12),
    },
  } as Palette;
};

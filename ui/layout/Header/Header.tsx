import assest from '@/json/assest';
import { DrawerContain, HeaderDrawer, HeaderWrap } from '@/styles/StyledComponents/HeaderWrapper';
import CustomButtonPrimary from '@/ui/CustomButtons/CustomButtonPrimary';
import MenuIcon from '@mui/icons-material/Menu';
import { Container, Stack } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as React from 'react';

export default function Header() {
  const navItems = [
    {
      name: 'Home',
      route: '/',
    },
    {
      name: 'Our Features',
      route: 'javscript:void(0)',
    },
    {
      name: 'How It Works',
      route: 'javscript:void(0)',
    },
    {
      name: 'About Us',
      route: '/about-us',
    },
    {
      name: 'Contact Us',
      route: '/contact-us',
    },
  ];

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();
  const [isHomePage, setIsHomePage] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  React.useEffect(() => {
    setIsHomePage(router.pathname === '/');
  }, [router.pathname]);

  const drawer = (
    <DrawerContain onClick={handleDrawerToggle}>
      <Link href='/' className='drw-logo'>
        <Image src={assest.logo_img} width={100} height={30} alt='Logo' />
      </Link>
      <Divider />
      <List>
        {navItems.map((item, index) => (
          <ListItem disablePadding key={index}>
            <Link href={item.route}>
              <ListItemButton sx={{ textAlign: 'center' }}>
                <ListItemText primary={item.name} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </DrawerContain>
  );

  return (
    <HeaderWrap>
      <AppBar
        component='nav'
        elevation={0}
        className='headerContainer'
        position={isHomePage ? 'fixed' : 'relative'}
      >
        <Container fixed>
          <Toolbar>
            <Link href='/' className='headerLogo'>
              <Image src={assest.logo_img} width={188} height={55} alt='Logo' />
            </Link>
            <List
              disablePadding
              sx={{
                display: {
                  xs: 'none',
                  md: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                },
              }}
              className='navbar'
            >
              {navItems.map(item => (
                <ListItem disablePadding key={item?.route}>
                  <Link
                    href={item?.route}
                    className={router.pathname === item.route ? 'active' : ''}
                  >
                    {item?.name}
                  </Link>
                </ListItem>
              ))}
            </List>
            <Stack direction='row' alignItems='center' flexWrap='wrap' className='hdr_rgt'>
              <CustomButtonPrimary type='button' variant='contained' color='primary'>
                Download App
              </CustomButtonPrimary>
              <IconButton
                color='inherit'
                aria-label='open drawer'
                onClick={handleDrawerToggle}
                sx={{ display: { md: 'none' } }}
                disableRipple
                className='menu-btn'
              >
                <MenuIcon />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <HeaderDrawer
        variant='temporary'
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </HeaderDrawer>
    </HeaderWrap>
  );
}

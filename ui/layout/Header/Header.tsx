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
      route: '/#ourFeature',
    },
    {
      name: 'How It Works',
      route: '/#howItWorks',
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
  const [currentHash, setCurrentHash] = React.useState('');
  const [isHomePage, setIsHomePage] = React.useState(false);

  React.useEffect(() => {
    const handleRouteChange = (url: string) => {
      setIsHomePage(router.pathname === '/');

      const hashIndex = url.indexOf('#');
      const hash = hashIndex !== -1 ? url.substring(hashIndex) : '';
      setCurrentHash(hash);
    };

    handleRouteChange(router.asPath);

    router.events.on('routeChangeComplete', handleRouteChange);

    if (typeof window !== 'undefined') {
      const handleHashChange = () => {
        const hash = window.location.hash;
        setCurrentHash(hash);
      };

      window.addEventListener('hashchange', handleHashChange);
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
        window.removeEventListener('hashchange', handleHashChange);
      };
    }

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);

  const isActive = (route: string) => {
    if (route === '/') {
      return router.pathname === '/' && !currentHash;
    }

    if (route.includes('/#')) {
      if (router.pathname === '/') {
        const routeHash = route.substring(route.indexOf('#'));
        return currentHash === routeHash;
      }
      return false;
    }

    return router.pathname === route;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

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
                  <Link href={item?.route} className={isActive(item.route) ? 'active' : ''}>
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

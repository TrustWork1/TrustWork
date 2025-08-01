import assest from '@/json/assest';
import { Box, Grid2, List, ListItem, styled, Typography } from '@mui/material';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

const FooterWrap = styled(Box)`
  padding: 50px 0 30px;

  @media (max-width: 599px) {
    padding: 30px 0;
  }

  a {
    text-transform: capitalize;
    color: ${({ theme }) => theme.palette.text.secondary};

    &:hover {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  .ft-logo {
    @media (max-width: 599px) {
      width: 110px;
    }
  }

  .ftr-wrapper {
    .quick-links {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      flex-wrap: wrap;
      gap: 10px 40px;

      @media (max-width: 1199px) {
        gap: 15px;
      }

      @media (max-width: 899px) {
        gap: 10px 0;
        justify-content: flex-start;
        padding-top: 5px;
      }

      li {
        width: auto;

        @media (max-width: 899px) {
          width: 50%;
        }

        a {
          @media (max-width: 1199px) {
            font-size: 14px;
          }

          &.active {
            color: ${({ theme }) => theme.palette.primary.main};
          }
        }
      }
    }
  }

  .social-media-links {
    background-color: ${({ theme }) => theme.palette.primary.light};
    border-radius: 6px;
    padding: 18px;
    margin-top: 50px;

    @media (max-width: 1199px) {
      margin-top: 20px;
    }

    @media (max-width: 599px) {
      padding: 10px;
    }

    p {
      color: ${({ theme }) => theme.palette.text.secondary};

      @media (max-width: 599px) {
        font-size: 14px;
      }
    }
  }
`;

const Footer = () => {
  const navItems = [
    {
      name: 'Home',
      route: '/',
    },
    {
      name: 'About Us',
      route: '/about-us',
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
      name: 'Contact Us',
      route: '/contact-us',
    },
    {
      name: 'Privacy Policy',
      route: '/privacy-policy',
    },
    {
      name: 'Terms & Conditions',
      route: '/terms-and-conditions',
    },
  ];

  const router = useRouter();

  return (
    <>
      <FooterWrap>
        <Container fixed>
          <Grid2 container spacing={1} alignItems='center'>
            <Grid2 size={{ md: 2, xs: 12 }}>
              <Link href='/' className='ft-logo'>
                <Image src={assest.logo_img} width={212} height={62} alt='ftLogo' />
              </Link>
            </Grid2>
            <Grid2 size={{ md: 10, xs: 12 }}>
              <Box className='ftr-wrapper'>
                <List disablePadding className='quick-links'>
                  {navItems.map((item, index) => (
                    <ListItem disablePadding key={index}>
                      <Link
                        href={item?.route}
                        className={router.pathname === item.route ? 'active' : ''}
                      >
                        {item?.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Grid2>
          </Grid2>
          <Box className='social-media-links' sx={{ textAlign: 'center' }}>
            <Typography variant='body2'>
              © Copyright 2025 <Link href='/'>Trust Work</Link> - All Rights Reserved.
            </Typography>
          </Box>
        </Container>
      </FooterWrap>
    </>
  );
};

export default Footer;

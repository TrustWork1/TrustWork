import InnerBanner from '@/components/InnerBanner/InnerBanner';
import assest from '@/json/assest';
import Wrapper from '@/layout/wrapper/Wrapper';
import { TermsAndCondInner } from '@/styles/StyledComponents/TermsAndConditionsStyled';
import { Container, Typography } from '@mui/material';
import Image from 'next/image';

export default function PrivacyPolicy() {
  return (
    <Wrapper>
      <InnerBanner
        heading='Privacy Policy'
        subTitle='Nulla non enim tortor est euismod tempus maecenas vel adipiscing. Eget accumsan urna gravida placerat egestas dolor. Sed molestie.'
      />
      <TermsAndCondInner>
        <Image
          src={assest.starImage7}
          width={65}
          height={230}
          alt='starbg'
          className='float-right-bg-one'
        />
        <Image
          src={assest.starImage4}
          width={122}
          height={232}
          alt='starbg'
          className='float-right-bg-two-privacy'
        />
        <Image
          src={assest.starImage5}
          width={136}
          height={232}
          alt='starbg'
          className='float-left-bg-privacy'
        />
        <Container fixed>
          <Typography variant='h3'>Personal Statement</Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Semper justo pellentesque egestas nisl. Potenti
            erat sollicitudin egestas quis euismod ultrices. Pretium laoreet amet dolor at at
            tincidunt. Consequat volutpat suspendisse et pellentesque est quis.
          </Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Malesuada justo consequat sodales integer
            molestie. Velit egestas senectus tincidunt amet nunc. Nullam nisi ultrices turpis arcu.
            Mi in molestie diam hendrerit sociis nulla ultrices facilisis at. Cursus et ipsum lectus
            lectus risus id morbi ullamcorper posuere.
          </Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Elit cras aliquam sed in. Purus vitae nisl
            tortor et. Velit aenean fermentum tempor turpis neque tristique cursus laoreet. Lectus
            tortor vel ultricies eget amet vulputate tortor sed velit.
          </Typography>
          <Typography variant='body2'>
            Elit convallis cras sociis purus varius et facilisis mattis. Arcu ornare eu vivamus
            quis. Condimentum mollis vestibulum tempus mauris. Purus nisl molestie amet tortor
            vestibulum interdum mi. Velit in diam rhoncus quisque. Etiam varius nunc faucibus sem
            nisl arcu viverra magna et. Fusce lacus molestie morbi augue enim aliquet vel arcu sed.
            Congue et in suspendisse sit proin id id. Faucibus facilisis lectus semper elit
            facilisis convallis. Pellentesque venenatis tellus ipsum tristique massa faucibus
            egestas lorem id.
          </Typography>

          <Typography variant='h3'>What Are Cookies?</Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Semper justo pellentesque egestas nisl. Potenti
            erat sollicitudin egestas quis euismod ultrices. Pretium laoreet amet dolor at at
            tincidunt.
          </Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Malesuada justo consequat sodales integer
            molestie. Velit egestas senectus tincidunt amet nunc. Nullam nisi ultrices turpis arcu.
            Mi in molestie diam hendrerit sociis nulla ultrices facilisis at. Cursus et ipsum lectus
            lectus risus id morbi ullamcorper posuere.
          </Typography>

          <Typography variant='h3'>Why Do We Use Cookies?</Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Cursus sapien urna cras nulla malesuada hac
            turpis. Elementum arcu justo mauris sit aliquam adipiscing faucibus sit. Eget maecenas
            id ut lectus ut sit. Velit ac nisi risus gravida. Lacinia ac amet sapien varius vitae in
            amet nibh. Massa aliquet vitae velit at amet faucibus. In sed nulla odio habitant
            posuere ullamcorper volutpat eu.
          </Typography>
          <Typography variant='body2'>
            Enim non amet egestas faucibus ut est in. Vestibulum tempor arcu nisl eget eros sit
            ultricies lobortis. Ac tortor potenti fermentum faucibus morbi pharetra donec
            adipiscing. Platea turpis suscipit arcu enim amet. Amet purus ut euismod imperdiet
            fermentum adipiscing massa mattis. Pulvinar facilisis tincidunt proin pharetra in et.
            Tincidunt pretium dictumst dolor vehicula amet. In aliquet sodales feugiat nibh sed
            scelerisque. Euismod gravida ante laoreet facilisis varius. Sed elit pulvinar amet
            feugiat ut pulvinar tincidunt. Nunc enim faucibus nibh sollicitudin suspendisse. Non et
            malesuada eget et convallis eget. Netus lorem proin sollicitudin in non ultrices in.
          </Typography>
          <Typography variant='body2'>
            Hendrerit id at volutpat habitant augue. Pellentesque sollicitudin ultricies bibendum
            purus sed. Et tortor laoreet aliquet morbi sit. Scelerisque nisl purus aliquet ipsum
            suspendisse cras. Mauris risus ut dictum diam et vitae tempor sapien. Egestas tortor
            pharetra donec neque venenatis. Senectus euismod elementum turpis risus tellus tellus
            ut. Faucibus hac odio consequat feugiat lorem. Convallis in nulla ullamcorper curabitur.
            Fringilla pharetra tincidunt porttitor sodales nunc rhoncus aliquet proin. Libero nunc
            imperdiet orci egestas sit risus quam.
          </Typography>
          <Typography variant='body2'>
            Magnis magna sagittis nullam dictum vitae. Vestibulum cursus tincidunt aliquam blandit
            pharetra nisl pellentesque. Orci odio sed cras ante aliquam in consectetur eget
            facilisis. Vitae ultricies risus aliquet sed malesuada vulputate pellentesque. Et a
            adipiscing orci sed. Porttitor morbi gravida ut id mi facilisi quisque enim lectus.
            Mauris rutrum viverra neque pellentesque non urna diam tellus. Id quis blandit eget
            commodo tempor condimentum egestas.
          </Typography>

          <Typography variant='h3'>What Information Do We Gather Specially?</Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Cursus sapien urna cras nulla malesuada hac
            turpis. Elementum arcu justo mauris sit aliquam adipiscing faucibus sit. Eget maecenas
            id ut lectus ut sit. Velit ac nisi risus gravida. Lacinia ac amet sapien varius vitae in
            amet nibh. Massa aliquet vitae velit at amet faucibus. In sed nulla odio habitant
            posuere ullamcorper volutpat eu.
          </Typography>

          <Typography variant='h3'>Website Media</Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Cursus sapien urna cras nulla malesuada hac
            turpis. Elementum arcu justo mauris sit aliquam adipiscing faucibus sit. Eget maecenas
            id ut lectus ut sit. Velit ac nisi risus gravida. Lacinia ac amet sapien varius vitae in
            amet nibh. Massa aliquet vitae velit at amet faucibus. In sed nulla odio habitant
            posuere ullamcorper volutpat eu.
          </Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Cursus sapien urna cras nulla malesuada hac
            turpis. Elementum arcu justo mauris sit aliquam adipiscing faucibus sit. Eget maecenas
            id ut lectus ut sit. Velit ac nisi risus gravida. Lacinia ac amet sapien varius vitae in
            amet nibh. Massa aliquet vitae velit at amet faucibus. In sed nulla odio habitant
            posuere ullamcorper volutpat eu.
          </Typography>

          <Typography variant='h3'>Disclosure Of Your Information</Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Cursus sapien urna cras nulla malesuada hac
            turpis. Elementum arcu justo mauris sit aliquam adipiscing faucibus sit. Eget maecenas
            id ut lectus ut sit. Velit ac nisi risus gravida. Lacinia ac amet sapien varius vitae in
            amet nibh. Massa aliquet vitae velit at amet faucibus. In sed nulla odio habitant
            posuere ullamcorper volutpat eu.
          </Typography>

          <Typography variant='h3'>Updates</Typography>
          <Typography variant='body2'>
            Lorem ipsum dolor sit amet consectetur. Vestibulum risus quam ut amet velit accumsan. At
            volutpat malesuada arcu diam eu iaculis in a varius. Turpis egestas justo quis egestas
            quam. Enim nisl elementum massa hendrerit.
          </Typography>
        </Container>
      </TermsAndCondInner>
    </Wrapper>
  );
}

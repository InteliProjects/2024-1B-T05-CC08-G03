import * as React from 'react';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import Navbar from '@/components/navbar';
import Typography from '@mui/joy/Typography';
import ArrowForward from '@mui/icons-material/ArrowForward';
import Layout from '@/components/layout';
import { Dispatch, SetStateAction } from 'react';

interface LandingProps {
  setLanding: Dispatch<SetStateAction<boolean>>;
}

  const Landing: React.FC<LandingProps> = ({ setLanding}) =>{
  return (
    <Layout reversed>
      <Typography
        level="h1"
        fontWeight="xl"
        fontSize="clamp(1.875rem, 1.3636rem + 2.1818vw, 3rem)"
      >
        Desenvolva dinâmicas e jogos para crianças com TEA!
      </Typography>
      <Typography fontSize="lg" textColor="text.secondary" lineHeight="lg">
        A plataforma AXÉ é um ambiente de programação em blocos para auxiliar terapeutas na criação e personalização de dinâmicas para crianças com TEA.
      </Typography>
      <Button
        size="lg"
        endDecorator={<ArrowForward fontSize="small" />}
        sx={{ mt: 2, mb: 1, width: '100%', backgroundColor: '#708090'}}
        onClick={()=>{setLanding(false)}}
      >
        Criar dinâmica
      </Button>
    </Layout>
  );
}

export default Landing;
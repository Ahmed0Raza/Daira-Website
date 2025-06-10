import React, { useEffect, useRef } from 'react';
import { styled, keyframes } from '@mui/system';
import richMond from '../images/rich_mond.png';
import brainyteLogo from '../images/BrainyteLogo.jpg';
import mgc from '../images/mgc.jpg';

const REPEAT_COUNT = 4;  // 4×3 logos = 12 total (enough to fill a 500px track)

// animate exactly one “base set” width (50% of the track)
const scrollAnim = keyframes`
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const Wrapper = styled('div')({
  width: '100%',
  maxWidth: '500px',
  margin: '24px auto',
  padding: '0 10px',
});

const Heading = styled('h2')({
  textAlign: 'center',
  fontSize: '0.9rem',
  textTransform: 'uppercase',
  letterSpacing: '1.5px',
  color: '#F3E52F',
  margin: '0 0 8px',
});

const MarqueeContainer = styled('div')({
  position: 'relative',
  height: '36px',
  overflow: 'hidden',
  borderRadius: '8px',
  background: 'rgba(0,0,0,0.7)',
  backdropFilter: 'blur(6px)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
  border: '1px solid rgba(243,229,47,0.3)',
});

const Fade = styled('div')(({ side }) => ({
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: '40px',
  background:
    side === 'left'
      ? 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, transparent 100%)'
      : 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
  [side]: 0,
}));

const Glow = styled('div')({
  pointerEvents: 'none',
  position: 'absolute',
  inset: 0,
  background:
    'radial-gradient(circle at center, rgba(243,229,47,0.15) 0%, transparent 70%)',
});

const ScrollTrack = styled('div')({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  animation: `${scrollAnim} 25s linear infinite`,
  willChange: 'transform',
});

const Badge = styled('div')({
  flex: '0 0 auto',            // never shrink or grow
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 12px',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 0,
    width: '1px',
    height: '20px',
    background: 'rgba(243,229,47,0.4)',
  },
  '&:last-child::after': {
    display: 'none',
  },
});

const Logo = styled('img')({
  height: '24px',
  objectFit: 'contain',
  filter: 'grayscale(40%) brightness(1.3)',
  transition: 'transform 0.3s, filter 0.3s',
  '&:hover': {
    transform: 'scale(1.1)',
    filter: 'grayscale(0%) brightness(1.6)',
  },
});

export default function HomeSponsorsMarquee() {
  const scrollRef = useRef(null);
  const baseSponsors = [richMond, brainyteLogo, mgc];

  // random offset so you don’t always start in the same spot
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.style.animationDelay = `${-Math.random() * 25}s`;
    }
  }, []);

  // build a track 4× long (12 logos)
  const sponsors = Array(REPEAT_COUNT)
    .fill(baseSponsors)
    .flat();

  return (
    <Wrapper>
      <Heading>Our Sponsors</Heading>

      <MarqueeContainer>
        <Fade side="left" />
        <Fade side="right" />
        <Glow />

        <ScrollTrack ref={scrollRef}>
          {sponsors.map((src, i) => (
            <Badge key={i}>
              <Logo
                src={src}
                alt={`Sponsor ${i % baseSponsors.length + 1}`}
                draggable="false"
                loading="lazy"
              />
            </Badge>
          ))}
        </ScrollTrack>
      </MarqueeContainer>
    </Wrapper>
  );
}

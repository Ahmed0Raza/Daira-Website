import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {
  Container,
  Typography,
  styled,
  CircularProgress,
  Box,
  Grid,
} from '@mui/material';
import { useGuidebook } from '../service/guidebookService';
import { useEffect, useState } from 'react';

const CenteredHeading = styled('div')({
  textAlign: 'center',
});

const PDFViewer = () => {
  const { getGuidebook } = useGuidebook();
  const [guidebookUrl, setGuidebookUrl] = useState(null);
  const newplugin = defaultLayoutPlugin();

  useEffect(() => {
    const fetchGuidebook = async () => {
      const cache = await caches.open('guidebook-cache');
      const cachedResponse = await cache.match('guidebook');
      if (cachedResponse) {
        const expirationTime = cachedResponse.headers.get('Expires');
        if (!expirationTime || new Date(expirationTime) < new Date()) {
          const { blob, url } = await getGuidebook();
          if (blob) {
            const response = new Response(blob, {
              headers: {
                Expires: new Date(Date.now() + 1000 * 60 * 60).toUTCString(),
              },
            });
            cache.put('guidebook', response);
            setGuidebookUrl(url);
          } else {
            console.error('Error fetching guidebook');
          }
        } else {
          const cachedBlob = await cachedResponse.blob();
          if (cachedBlob) {
            const cachedBlobUrl = URL.createObjectURL(cachedBlob);
            setGuidebookUrl(cachedBlobUrl);
          }
        }
      } else {
        const { blob, url } = await getGuidebook();
        if (blob) {
          const response = new Response(blob, {
            headers: {
              Expires: new Date(Date.now() + 1000 * 60 * 60).toUTCString(), // Expires in 1 hour
            },
          });
          cache.put('guidebook', response);
          setGuidebookUrl(url);
        } else {
          console.error('Error fetching guidebook');
        }
      }
    };
    fetchGuidebook();
  }, [getGuidebook]);

  useEffect(() => {}, [guidebookUrl]);

  return (
    <Container sx={{ paddingTop: '200px' }}>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item>
          <CenteredHeading>
            <Typography
              variant="h4"
              sx={{
                color: '#fc8b00',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                fontWeight: 'bold',
                marginBottom: '20px',
                padding: { xs: '20px', sm: 'unset' },
              }}
            >
              GUIDE BOOK
            </Typography>
          </CenteredHeading>
        </Grid>
        <Grid item sx={{ marginLeft: '33px', marginTop: '-17px' }}>
          {!guidebookUrl && <CircularProgress />}
        </Grid>
      </Grid>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Container sx={{ height: '750px' }}>
          {guidebookUrl && (
            <Viewer fileUrl={guidebookUrl} plugins={[newplugin]} />
          )}
        </Container>
      </Worker>
    </Container>
  );
};

export default PDFViewer;

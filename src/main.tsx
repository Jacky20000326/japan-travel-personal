import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider as JotaiProvider } from 'jotai';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';
import './animations.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JotaiProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </JotaiProvider>
  </StrictMode>
);

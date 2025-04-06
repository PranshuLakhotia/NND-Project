import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { darkTheme, lightTheme } from './theme';
import Dashboard from './pages/Dashboard';
import ArpSpoofing from './pages/ArpSpoofing';
import Layout from './components/Layout';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/arp-spoofing" element={<ArpSpoofing />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './MegaApp.jsx';
import './native-tts.js';

createRoot(document.getElementById('root')).render(<App />);

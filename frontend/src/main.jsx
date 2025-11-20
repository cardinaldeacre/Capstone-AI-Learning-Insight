import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Alert } from 'flowbite-react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="flex justify-center">
      <h1>Hello World</h1>
    </div>
  </StrictMode>
);

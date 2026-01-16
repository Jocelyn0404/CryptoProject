// Debug: Log that script is loading
console.log('🚀 index.tsx is loading...');

import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('✅ React and App imported successfully');

// Error Boundary Component - removed due to TypeScript issues in React 19

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('❌ Root element not found!');
  throw new Error("Could not find root element to mount to");
}

console.log('✅ Root element found:', rootElement);

// Add error handlers for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

try {
  console.log('🎨 Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('🎨 Rendering App...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ App rendered successfully!');
} catch (error) {
  console.error('❌ Failed to render app:', error);
  rootElement.innerHTML = `
    <div style="padding: 40px; color: white; background: #0f172a; min-height: 100vh; font-family: system-ui;">
      <h1 style="color: #ef4444;">Render Error</h1>
      <p>Error: ${error instanceof Error ? error.message : String(error)}</p>
      <p style="margin-top: 20px; color: #94a3b8;">Check the console for more details.</p>
    </div>
  `;
}

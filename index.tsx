// Debug: Log that script is loading
console.log('🚀 index.tsx is loading...');

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log('✅ React and App imported successfully');

// Error Boundary Component
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: Error }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          minHeight: '100vh', 
          background: '#0f172a', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '20px',
          color: '#e2e8f0'
        }}>
          <div style={{ 
            maxWidth: '600px', 
            background: '#1e293b', 
            border: '1px solid rgba(248, 113, 113, 0.2)', 
            padding: '40px', 
            borderRadius: '16px' 
          }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px', color: '#fff' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#94a3b8', marginBottom: '20px' }}>
              The app encountered an error. Please check the console for details and refresh the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px',
                background: '#06b6d4',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
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

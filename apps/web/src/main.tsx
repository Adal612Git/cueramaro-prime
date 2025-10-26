import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import './index.css';
import App from './App';

function mountReact() {
  let rootElement = document.getElementById('root');
  if (!rootElement) {
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </React.StrictMode>,
  );
}
document.readyState === 'loading'
  ? document.addEventListener('DOMContentLoaded', mountReact)
  : mountReact();

if (import.meta.env.DEV) {
  import('./sw-dev-cleanup').then((m) => m.unregisterSW && m.unregisterSW());
}

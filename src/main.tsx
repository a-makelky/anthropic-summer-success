import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

try {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Root element not found");
  }
  const root = createRoot(container);
  root.render(<App />);
} catch (error) {
  console.error("Failed to render app:", error);
  document.body.innerHTML = `<div style="color: red; padding: 20px;">Error: ${error}</div>`;
}

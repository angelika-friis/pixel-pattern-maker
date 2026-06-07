import { createRoot } from 'react-dom/client';
import { App } from './app/App';
import './styles/styles.css';

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element saknas.');
}

createRoot(root).render(<App />);

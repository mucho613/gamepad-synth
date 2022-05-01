import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import App from './components/App';
import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);

reportWebVitals();

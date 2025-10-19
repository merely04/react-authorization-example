import '@ant-design/v5-patch-for-react-19';
import { createRoot } from 'react-dom/client';
import { App } from '~/app';

import { appStarted } from './shared/init';

const container = document.getElementById('root')!;
const root = createRoot(container);

appStarted();

root.render(<App />);

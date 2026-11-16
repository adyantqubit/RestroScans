'use client';

import Context from './context/Context';
import App from './App';

export default function CustomerApp() {
  return (
    <Context>
      <App />
    </Context>
  );
}

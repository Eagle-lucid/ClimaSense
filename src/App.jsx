// src/App.jsx
import { Suspense } from 'react';
import Header from './components/header/Header';

function App() {
  return (
    <div className="app-container">
      {/* Show welcome screen while loading */}

      {/* Main header */}
      <Header />
    </div>
  );
}

export default App;

import React from 'react';
import { useAppDispatch, useAppSelector } from './app/hooks';
import { setActiveView } from './app/uiSlice';
import GarageView from './features/garage/GarageView';
import WinnersView from './features/winners/WinnersView';
import './App.css';

function App(): React.ReactElement {
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state) => state.ui.activeView);

  return (
    <div className="app">
      <nav className="app-nav">
        <button
          type="button"
          className={activeView === 'garage' ? 'nav-button active' : 'nav-button'}
          onClick={() => dispatch(setActiveView('garage'))}
        >
          Garage
        </button>
        <button
          type="button"
          className={activeView === 'winners' ? 'nav-button active' : 'nav-button'}
          onClick={() => dispatch(setActiveView('winners'))}
        >
          Winners
        </button>
      </nav>

      <main className="app-main">{activeView === 'garage' ? <GarageView /> : <WinnersView />}</main>
    </div>
  );
}

export default App;

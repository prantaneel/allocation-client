import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DailyRecord from './components/dailyRecord';
import CatalogComponent from './components/catalogComp';
import { GlobalStateProvider } from './components/globalState';
import './components/component.css'

function App() {
  return (
    <GlobalStateProvider>
<Router>
      <nav className='flex-nav'>
        <div className='logo-header'>
          <h1>FAL</h1>
        </div>
        <div className='button-group'>
          <button>
            <Link to="/">Home</Link>
          </button>
          <button>
            <Link to="/catalog">Catalog</Link>
          </button>
        </div>
        <div>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<DailyRecord />} />
        <Route path="/catalog" element={<CatalogComponent />} />
      </Routes>
    </Router>
    </GlobalStateProvider>
    
  );
}

export default App;

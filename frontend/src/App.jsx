import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import StylesPage from './pages/Styles';
import Training from './pages/Training';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-background-start to-background-end flex flex-col font-sans text-white">
        <Navbar />
        <main className="flex-1 w-full flex flex-col items-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/styles" element={<StylesPage />} />
            <Route path="/training" element={<Training />} />
            <Route path="/results" element={<Results />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

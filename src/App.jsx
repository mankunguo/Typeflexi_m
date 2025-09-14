import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import './App.css'

function App() {

  return (
    <>
        <Router>
      <div>
        {/* <Header /> */}
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
          </ul>
        </nav> */}
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
      </div>
    </Router>
    </>
  )
}

export default App

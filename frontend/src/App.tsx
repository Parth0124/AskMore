import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { AuthProvider } from "./context/AuthContext";
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
{/*import  { Footer } from './components/Footer';*/}


function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/chat"
                element={
                  <>
                    <Dashboard />
                    <ChatInterface />
                  </>
                }
              />
            </Routes>
          </div>
          {/* <Footer/> */}
          {/* Add the Footer component here */}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
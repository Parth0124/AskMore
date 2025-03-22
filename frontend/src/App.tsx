import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ChatInterface } from './components/ChatInterface';
import { Home } from './pages/Home';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
{/*import  { Footer } from './components/Footer';*/}


function App() {
  return (
    <Router>
      <AuthProvider>
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
         {/* <Footer/> */}{/* Add the Footer component here */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
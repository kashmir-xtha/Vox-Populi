import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/navbar"
import Home from "./components/home"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Signup from "./components/Signup"

function App() {
  return (
    <>
      <Router basename="/">
        {/* basename acts as the domain for the upcoming routes and should be similar to gh-homepage name  */}
        <Navbar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/login" Component={Login} />
          <Route path="/signup" Component={Signup} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App

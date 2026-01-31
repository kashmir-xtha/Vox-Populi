import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Footer from "./components/Footer"
import Login from "./components/Login"
import Signup from "./components/Signup"
import AdminDashboard from "./components/AdminDashboard"
import AdminCreatePositions from "./components/AdminCreatePositions"
import AdminApproveCandidates from "./components/AdminApproveCandidates"
import CandidateApplicationForm from "./components/CandidateApplicationForm"
import VoterBallot from "./components/VoterBallot"
import AdminResults from "./components/AdminResults"

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
          <Route path="/adminDashboard" Component={AdminDashboard} />
          <Route path="/adminCreatePositions" Component={AdminCreatePositions} />
          <Route path="/adminApproveCandidates" Component={AdminApproveCandidates} />
          <Route path="/adminResults" Component={AdminResults} />
          <Route path="/candidateApplicationForm" Component={CandidateApplicationForm} />
          <Route path="/voterBallot" Component={VoterBallot} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App

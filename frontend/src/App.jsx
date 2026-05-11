import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AddListing from "./pages/AddListing";
import BrowseCoupons from "./pages/BrowseCoupons";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container my-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-listing" element={<AddListing />} />
          <Route path="/browse" element={<BrowseCoupons />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Listings from "./pages/Listings";
// import CreateListing from "./pages/CreateListing";
// import Profile from "./pages/Profile";
// import Chat from "./pages/Chat";
// import Footer from "./components/Footer";
// import "./styles.css";

// function App() {
//   return (
//     <Router>
//       <Navbar />
//       <Routes>
//         <Route path="/" element={<Hero />} />
//         <Route path="/listings" element={<Listings />} />
//         <Route path="/create" element={<CreateListing />} />
//         <Route path="/profile" element={<Profile />} />
//         <Route path="/chat" element={<Chat />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Home from './Pages/Home/Homepage';
import Categories from './Pages/Categories/Categories';
import NotFound from './Pages/404';
import SearchModal from './components/Modals/SearchModal';
import CartModal from './components/Modals/CartModal';
import NotificationBar from './components/NotificationBar'; // Assuming you have this component as well

const App = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const toggleSearchModal = () => setSearchOpen(!searchOpen);
  const toggleCartModal = () => setCartOpen(!cartOpen);

  return (
    <Router>
      <div className="relative min-h-screen">
        <NotificationBar />
        <Navbar 
          toggleSearchModal={toggleSearchModal} 
          toggleCartModal={toggleCartModal} 
        />
        
        {/* Modals for Search and Cart */}
        {searchOpen && <SearchModal closeModal={toggleSearchModal} />}
        {cartOpen && <CartModal closeModal={toggleCartModal} />}
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Categories />
      </div>
    </Router>
  );
};

export default App;

import React, { useEffect, useRef, useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import ComingSoonPage from './components/CommingSoon';
import { TestSeries } from './components/TestSeries';
import DomainFilter from './components/DomainFilter';
import ExploreSection from './components/ExploreSection';
import MultipleCourseCart from './components/AddedCourseCart';
import ContactUs from './components/ContactUs';

function App() {

  const [showModal, setShowModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const timeoutRef = useRef(null);
  const hasSubmitted = localStorage.getItem('formSubmitted') === 'true';

  console.log('courses', courses);
  

  useEffect(() => {
    if (hasSubmitted) return;

    const handleUserActivity = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowModal(true);
      }, 3000); // 3 seconds
    };

    // Attach activity listeners
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('scroll', handleUserActivity);

    // Start inactivity timer initially
    handleUserActivity();

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('scroll', handleUserActivity);
      clearTimeout(timeoutRef.current);
    };
  }, [hasSubmitted]);


  return (
    <React.Fragment>
      <Router>
        {showModal && <ContactUs handleClose={() => setShowModal(false)} courses={courses} />}
        <Routes>
          <Route path="/" element={<DomainFilter setCourses={setCourses} />} />
          <Route path="/explore-all" element={<ExploreSection setCourses={setCourses} />} />
          <Route path="/cart-courses" element={<MultipleCourseCart />} />
          <Route path="*" element={<ComingSoonPage />} />
          <Route path="/test-series/:id" element={<TestSeries />} />
        </Routes>
      </Router>
      <FloatingWhatsApp phoneNumber={'+91-8440930809'} accountName="ClassKart"
        chatMessage="Hello! How can I help you?" className="classcart-whatsapp-avatar" />
    </React.Fragment>
  )
}

export default App

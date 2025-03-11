import React from "react";
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { TestSeries } from './components/test-series/TestSeries';
import { FloatingWhatsApp } from 'react-floating-whatsapp';

import ComingSoonPage from './components/CominSoon';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<ComingSoonPage />} />
          <Route path="*" element={<ComingSoonPage />} />
          <Route path="/test-series/:id" element={<TestSeries />} />
        </Routes>
      </Router>
      <FloatingWhatsApp phoneNumber={'+91-8440930809'} accountName="ClassKart"
        chatMessage="Hello! How can I help you?" className="classcart-whatsapp-avatar" />
    </React.Fragment>
  );
}

export default App;

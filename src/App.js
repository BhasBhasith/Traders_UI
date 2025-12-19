import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/dashboard/Dashboard';
import CompanyList from './components/master/CompanyList';
import CompanyForm from './components/master/CompanyForm';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/company" element={<CompanyList />} />
          <Route path="/company/add" element={<CompanyForm />} />
          <Route path="/company/edit/:id" element={<CompanyForm />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

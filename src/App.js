import React, { useState, useEffect } from 'react';
import CategoryTable from './components/CategoryTable';
import './App.css';

function App() {

  return (
    <div className="App">
      <h1>Category Table</h1>
      <CategoryTable />
    </div>
  );
}

export default App;

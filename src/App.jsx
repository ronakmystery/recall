import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';

import './App.css'

function Home() {

  let courses = ["formal-languages", "algorithms"]


  return <div id="home">Welcome to the Home Page

<nav>

<ul>
  {courses.map(course => (
    <li key={course}>
      <li><Link to={`${course}`}>{course}</Link></li>
    </li>
  ))}

</ul>
</nav>

  </div>;
}


function ClassPage() {
  const { className } = useParams();
  return <div id="class-page">{className}
  </div>;
}


function App() {



  return (
    <div id="app">
       <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:className" element={<ClassPage />} />
      </Routes>
    </Router>
    </div>
   
  )
}

export default App


import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css'
import { useEffect, useState } from 'react';

import {AddNote}  from './components/AddNote';
import { GetNotes } from './components/GetNotes';



function Courses() {
  const { course} = useParams();





  return <div id="courses">

    
    {course}


    {<GetNotes course={course}/>}
    {<AddNote course={course}/>}

              



  </div>;
}



function Home() {

  let courses = ["formal-languages", "algorithms"]


  return <div id="home">Welcome to the Home Page

<nav>

<ul>
  {courses.map(course => (
      <li key={course}><Link to={`${course}`}>{course}</Link></li>
  ))}

</ul>
</nav>

  </div>;
}




function App() {



  return (
    <div id="app">
       <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:course" element={<Courses />} />
      </Routes>
    </Router>
    </div>
   
  )
}

export default App

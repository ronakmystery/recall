
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css'
import { useEffect, useState } from 'react';

import { AddNote } from './components/AddNote';
import { GetNotes } from './components/GetNotes';





function Courses() {
  const { course } = useParams();

  const [action, setAction] = useState(['study notes'])

  let actions = {
    'study notes': <GetNotes course={course} />,
    'add note': <AddNote course={course} />,
  }



  return <div id="course">

<Link to={'/'}><button id="home-button-link">home</button></Link>

    <div id="course-name">    {course}
    </div>
    <div id="actions">
      {
        Object.keys(actions).map((x) => <button
        key={x}
          className={`action ${action == x && 'selected-action'}`}
          onClick={() => setAction(x)}>{x}</button>)
      }
    </div>

    <div>  {actions[action]}</div>
  </div>;
}



function Home() {

  let courses = ["formal-languages", "algorithms"]
  

  return <div id="home">

 

    
Courses
      <div id="courses-list">
        {courses.map(course => (
          <Link to={`/${course}`}><button
          className='course-link'
          key={course}>{course}</button></Link>
        ))}

      </div>



  Study using a problem-solution approach.
   <br/> 
   <br/>
   Designed and developed by Ronak Mistry.
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

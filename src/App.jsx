
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



  return <div id="courses">

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
    <button id="home-button-link"><Link to={'/'}>home</Link></button>
  </div>;
}



function Home() {

  let courses = ["formal-languages", "algorithms"]
  

  return <div id="home">

 

    
Courses
      <ul>
        {courses.map(course => (
          <button
            className='course-link'
            key={course}><Link to={`/${course}`}>{course}</Link></button>
        ))}

      </ul>



    Study using a problem-solution method.
   <div></div> 
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

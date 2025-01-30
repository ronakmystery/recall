
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css'
import { useEffect, useState } from 'react';

import { AddNote } from './components/AddNote';
import { GetNotes } from './components/GetNotes';
import { ShowAllNotes } from './components/ShowAllNotes';

import { useGlobalState } from './GlobalContext';





function Courses() {
  const { course } = useParams();

  // const [action, setAction] = useState(['study notes'])
    const [action, setAction] = useState(['study'])


  let actions = {
    'study': <GetNotes course={course} />,
    'all notes': <ShowAllNotes course={course} />,
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

  let courses = ["formal-languages", "algorithms","examples"]

  const { user, setUser } = useGlobalState();



  const handleLogin = () => {
    const password = prompt('password:');
    if (password=='3654') {
      localStorage.setItem('user', JSON.stringify('admin'));
      setUser('admin')
    }
  };
  

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


   <div id='admin'>{user=='admin' ? (
        <div>ADMIN</div>
      ) : (
        <button onClick={handleLogin}>admin</button>
      )}</div>


      
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

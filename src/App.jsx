
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import './App.css'
import { useEffect, useState } from 'react';

import { AddNote } from './components/AddNote';
import { GetNotes } from './components/GetNotes';
import { ShowAllNotes } from './components/ShowAllNotes';

import { useGlobalState } from './GlobalContext';

import {  addCourseToFireStore, getCoursesFromFireStore } from './firebase';




function Courses() {
  const { course } = useParams();
  

  const [action, setAction] = useState(['study'])


  let actions = {
    'study': <GetNotes course={course} />,
    'all notes': <ShowAllNotes course={course} />,
    'new note': <AddNote course={course} />,

  }



  return <div id="course">


    <Link to={'/'}><button id="home-button-link">home</button></Link>

    
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

  const [courses, setCourses] = useState([])

  useEffect(() => {

    getCourses()


  }, [])

  let getCourses = () => {
    getCoursesFromFireStore().then(data => {
      setCourses(data)
    })
  }

  const { user, setUser } = useGlobalState();



  const handleLogin = () => {
    const password = prompt('password:');
    if (password == '3654') {
      localStorage.setItem('user', JSON.stringify('admin'));
      setUser('admin')
    }
  };

  const addCourse = () => {
    let data = {}

    let course = prompt('course:')

    if (course) {
      data.name = course
      addCourseToFireStore(data).then(() => {
        getCourses()
      })

    }
  }


  return <div id="home">

    Courses
    <div id="courses-list">
      {courses.map(course => (
        <Link to={`/${course.id}`}
          key={course.id}
        ><button
          className='course-link'
        >{course.name}</button></Link>
      ))}

      <button onClick={addCourse}>add course</button>

    </div>



    Study using a problem-solution approach.
    <br />
    <br />
    Designed and developed by Ronak Mistry.


    <div id='admin'>{user == 'admin' ? (
      ""
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

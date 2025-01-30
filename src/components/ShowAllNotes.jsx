import { useEffect, useState } from 'react';
import { firebaseGet, firebaseDelete } from '../firebase';
import './ShowAllNotes.css'
import { useGlobalState } from '../GlobalContext';


export const ShowAllNotes = ({ course }) => {


    const [notes, setNotes] = useState([]);

    useEffect(() => {

        fetchNotes()

    }, [])

    let fetchNotes = () => {


        firebaseGet(course).then(data => {

            const sortedNotes = data.sort((a, b) => {
                // Compare by `seconds` first, and then by `nanoseconds` if `seconds` are equal
                if (a.created_at.seconds === b.created_at.seconds) {
                    return b.created_at.nanoseconds - a.created_at.nanoseconds;
                }
                return b.created_at.seconds - a.created_at.seconds;
            });

            setNotes(sortedNotes)

        })
    }

    const { user, setUser } = useGlobalState();
    
    let deleteNote = (id) => {


        if(user=='admin'&& confirm('delete?')){
            firebaseDelete(course, id).then(() => {
                const [item, ...items] = notes;
                setNotes(items);
            })
        }



    }


    return <>

        <div id="all-notes">{
            notes.map(x =>

                <div className="note" key={x.id}>

                    <div className='note-imgs'>


                        <div><img
                                src={x.frontImgUrl} alt="Front Preview" /></div>


                        <div><img
                            src={x.backImgUrl} alt="Back Preview" /></div>

                    </div>

                {user=='admin'&&<button id="card-delete-button"
                        onClick={() => { deleteNote(x.id) }}
                    >delete</button>}
                    
                </div>)

        }</div>

    </>



}
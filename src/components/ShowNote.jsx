import { useEffect, useState } from 'react';
import './ShowNote.css'
import { motion } from "framer-motion";
import { firebaseGet, firebaseDelete } from '../firebase';
import { useGlobalState } from '../GlobalContext';



export const ShowNote = ({ course }) => {

    const [notes, setNotes] = useState([]);

    const [note, setNote] = useState(null)

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

            setNote(sortedNotes[0])
        })
    }




    const [currentNote, setCurrentNote] = useState(0)
    const [noteState, setNoteState] = useState(false)

    let prev = () => {
        setNote(null)
        setNoteState(false);
        setTimeout(() => {
            let note = currentNote - 1
            if (note < 0) {
                note = notes.length - 1
            }
            setNote(notes[note])
            setCurrentNote(note)
        }, 100);


    }
    let next = () => {
        setNote(null)
        setNoteState(false);

        setTimeout(() => {
            let note = currentNote + 1
            if (note == notes.length) {
                note = 0
            }
            setNote(notes[note])
            setCurrentNote(note)
        }, 100);


    }



    const { user, setUser } = useGlobalState();
    const [message, setMessage] = useState(null)

    let deleteNote = () => {

        if (user == 'admin' && confirm('delete?')) {
            setMessage('DELETING...')
            firebaseDelete(course, note?.id).then(() => {
                setNoteState(false);

                const [item, ...items] = notes;
                setNotes(items);
                setNote(items[0])
                setMessage(null)

            })
        }





    }



    return <div
        id="show-note"
    >   
        {notes.length==0&&<div id='no-notes'>No notes...</div>}

        {notes.length !== 0 &&


            <>
                <div id="card-remaining">{currentNote + 1} / {notes.length}</div>


                {user == 'admin' && !message && <button id="card-delete-button"
                    onClick={() => { deleteNote() }}
                >delete</button>}
                {user == 'admin' && message && <button id="message">{message}</button>}

                <div
                    className='note'
                >
                    <div
                        className='images'

                    >

                        {note && noteState && <motion.img
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className='solution'
                            src={note?.backImgUrl} alt="solution" />
                        }

                        {
                            note && !noteState&&<><img style={{ display: 'none' }}
                                src={note?.backImgUrl} alt="preload" />
                                <motion.img 
                                  initial={{ opacity: 0, y: 50 }}
                                  animate={{ opacity: 1, y: 0 }}
                                src={note?.frontImgUrl} alt="problem" /></>
                        }

                    </div>


                </div>
                <div className='actions'>
                    {notes.length > 1 && <button
                        onClick={prev}
                    >prev</button>}


                    <button id="card-flip-button"
                        onClick={() => { setNoteState(!noteState) }}
                    >{noteState ? 'problem' : 'solution'}</button>

                    {notes.length > 1 && <button
                        onClick={next}
                    >next</button>}
                </div>


            </>

        }





    </div>;
}
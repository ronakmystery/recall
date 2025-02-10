import { useEffect, useState } from 'react';
import { firebaseGet, firebaseDelete } from '../firebase';
import './ShowAllNotes.css'
import { useGlobalState } from '../GlobalContext';
import { motion } from "framer-motion";


export const ShowAllNotes = ({ course }) => {


    const [notes, setNotes] = useState([]);

    const [message, setMessage] = useState(null)



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


        if (user == 'admin' && confirm('delete?')) {
            setMessage('deleting...')
            firebaseDelete(course, id).then(() => {
                const [item, ...items] = notes;
                setNotes(items);
                setMessage(null)
            })
        }



    }

    const [visibleNotes, setVisibleNotes] = useState({});

    const toggleNote = (id) => {
        setVisibleNotes((prev) => ({ ...prev, [id]: !prev[id] }));
    };


    return <>

        <div id="all-notes">

            {notes.length == 0 && <div id='no-notes'>No notes...</div>}
            {
                notes.map(x =>

                    <div className="note" key={x.id}>



                        <div className='images'>

                            <img
                                loading='lazy'
                                src={x.frontImgUrl} alt="Front Preview" />

                            {!visibleNotes[x.id] && (<button onClick={() => { toggleNote(x.id) }}>solution</button>
                            )}

                            {visibleNotes[x.id] && (
                                <motion.img
                                    src={x.backImgUrl}
                                    className="solution"
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                />
                            )}

                        </div>
                        {user == 'admin' && !message && <button id="card-delete-button"
                            onClick={() => { deleteNote(x.id) }}
                        >delete note</button>}
                        {user == 'admin' && message && <button id="message-button">{message}</button>}





                    </div>)

            }</div>

    </>



}
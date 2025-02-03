import { useEffect, useState } from 'react';
import './GetNotes.css'
import { motion } from "framer-motion";
import { firebaseGet,firebaseDelete } from '../firebase';
import { useGlobalState } from '../GlobalContext';



export const GetNotes = ({ course }) => {

    const [notes, setNotes] = useState([]);

    const [note, setNote] = useState(null)
    const [completed, setCompleted] = useState([])

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


    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    let next = () => {
        setIsFlipped(false);

        const [item, ...items] = notes;

        setNotes(items);
        setCompleted((prev) => [...prev, item]);
        setNote(items[0])
    }

    let skip = () => {
        setIsFlipped(false);
        setNotes((prevNotes) => {
            const [item, ...items] = prevNotes; // Destructure the first item
            const updatedNotes = [...items, item]; // Move it to the end
            setNote(updatedNotes[0]); // Update the current note to the new first item
            return updatedNotes; // Update the state of notes
        });
    };

    let reset = () => {
        setIsFlipped(false);
        setNotes(completed)
        setCompleted([])
        setNote(completed[0])
    }

    const { user, setUser } = useGlobalState();

    let deleteNote = () => {

        
        if(user=='admin'&& confirm('delete?')){
            firebaseDelete(course, note?.id).then(() => {
                setIsFlipped(false);

                const [item, ...items] = notes;
                setNotes(items);
                setNote(items[0])
            })
        }



    }

    return <motion.div
        id="notes"
        initial={{ opacity: 0 }} // Start invisible
        animate={{ opacity: 1 }} // Fade in to fully visible
        transition={{ duration: .3 }} // Animation duration
    >


        {notes.length == 0 && completed.length > 0 && <div>
            <button id="reset-button"
                onClick={reset}
            >study again</button></div>}

        {notes.length !== 0 &&


            <>
                <div id="card-remaining">{completed.length+1} / {notes.length + completed.length}</div>

                <div id="card-type">{!isFlipped ? 'PROBLEM' : 'SOLUTION'}</div>



                <div
                    id={note?.id}
                    className={`note-card ${isFlipped ? 'flipped' : ''}`}
                >

                    {/* Front Side */}
                    {!isFlipped && <div className="note-card-front">
                        <img src={note?.frontImgUrl} alt="Front Preview" />
                    </div>}


                    {/* Back Side */}
                    {isFlipped && <div className="note-card-back">
                        <img src={note?.backImgUrl} alt="Back Preview" />
                    </div>}
                </div>

                <div id="card-actions">


                    {notes.length > 1 && <button id="card-skip-button"
                        onClick={skip}
                    >skip</button>}


                    <button id="card-flip-button"
                        onClick={handleFlip}
                    >{isFlipped ? 'see problem' : 'see solution'}</button>

                    <button id="card-next-button"
                        onClick={next}
                    >done</button>

                    {user=='admin'&& <button id="card-delete-button"
                        onClick={deleteNote}
                    >delete</button>}
                   
                </div>
            </>






        }

    




    </motion.div>;
}
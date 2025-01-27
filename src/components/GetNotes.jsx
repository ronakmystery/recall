import { firebaseGet } from '../firebase';
import { useEffect, useState } from 'react';
import './GetNotes.css'
import { motion } from "framer-motion";
import { firebaseDelete } from '../firebase';


export const GetNotes = ({ course }) => {

    const [notes, setNotes] = useState([]);

    const [note, setNote] = useState(null)
    const [completed, setCompleted] = useState([])

    useEffect(() => {

        fetchNotes()

    }, [])

    let fetchNotes = () => {
        firebaseGet(course).then(data => {

            data.sort((a, b) => {
                // Sort by newest date first
                const dateComparison = new Date(b.date) - new Date(a.date);
                if (dateComparison !== 0) return dateComparison;

                // If dates are the same, sort by highest rating
                return b.rating - a.rating;
            });

            setNotes(data)
            setNote(data[0])
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

    let deleteNote = () => {

        let userConfirmed = window.prompt("confirm with password");

        if (userConfirmed=="3654") {
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
        transition={{ duration: 1 }} // Animation duration
    >


        {notes.length == 0 && completed.length > 0 && <div>
            <button id="reset-button"
                onClick={reset}
            >reset</button></div>}

        {notes.length !== 0 &&


            <> <div id="card-type">{!isFlipped ? 'PROBLEM' : 'SOLUTION'}</div>



                <div
                    id={note?.id}
                    className={`note-card ${isFlipped ? 'flipped' : ''}`}
                >

                    {/* Front Side */}
                    <div className="note-card-front">
                        <img src={note?.frontImgUrl} alt="Front Preview" />
                    </div>

                    {/* Back Side */}
                    <div className="note-card-back">
                        <img src={note?.backImgUrl} alt="Back Preview" />
                    </div>
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
                    >next</button>

                    <button id="card-delete-button"
                        onClick={deleteNote}
                    >delete</button>
                </div>
                <div id="card-remaining">{completed.length}/{notes.length + completed.length}</div>
            </>






        }

        {

            notes.length == 0 && <div id="notes">no cards</div>

        }





    </motion.div>;
}
import { useEffect, useState } from 'react';
import './GetNotes.css'
import { motion, useMotionValue, useTransform, useMotionValueEvent } from "framer-motion";
import { firebaseGet, firebaseDelete } from '../firebase';
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

    const [currentNote, setCurrentNote] = useState(0)

    let prev = () => {
        setIsFlipped(false);
        let note = currentNote - 1
        if (note < 0) {
            note = notes.length - 1
        }
        setNote(notes[note])
        setCurrentNote(note)
    }
    let next = () => {
        setIsFlipped(false);
        let note = currentNote + 1
        if (note == notes.length) {
            note = 0
        }
        setNote(notes[note])
        setCurrentNote(note)
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
    const [message, setMessage] = useState(null)

    let deleteNote = () => {

        if (user == 'admin' && confirm('delete?')) {
            setMessage('DELETING...')
            firebaseDelete(course, note?.id).then(() => {
                setIsFlipped(false);

                const [item, ...items] = notes;
                setNotes(items);
                setNote(items[0])
                setMessage(null)

            })
        }





    }


    const x = useMotionValue(0)
    const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])
    const rotate = useTransform(x, [-100, 100], [-10, 10])



    const handleDrag = () => {
        let val = x.get()
        if (val < 50) {
            next()
        }

        if (val > -50) {
            prev()
        }
    }

    return <div
        id="notes"
    >


        {notes.length == 0 && completed.length > 0 && <div>
            <button id="reset-button"
                onClick={reset}
            >study again</button></div>}

        {notes.length !== 0 &&


            <>
                <div id="card-remaining">{currentNote + 1} / {notes.length}</div>

                <div id="card-type">{!isFlipped ? 'PROBLEM' : 'SOLUTION'}</div>



                <div
                    id={note?.id}
                    className={`note-card ${isFlipped ? 'flipped' : ''}`}
                >

                    {/* Front Side */}
                    {!isFlipped && <div className="note-card-front">
                        <motion.img
                            onClick={() => { setIsFlipped(!isFlipped) }}
                            style={{ x, opacity, rotate }}

                            drag="x"
                            onDragEnd={handleDrag}



                            dragConstraints={{
                                left: 0, right: 0
                            }}

                            src={note?.frontImgUrl} alt="Front Preview" />
                    </div>}


                    {/* Back Side */}
                    {isFlipped && <div className="note-card-back"
                        onClick={() => { setIsFlipped(!isFlipped) }}

                    >
                        <motion.div onClick={() => { setIsFlipped(!isFlipped) }}
                            style={{ x, opacity, rotate }}

                            drag="x"
                            onDragEnd={handleDrag}
                            dragElastic={.7}
                            dragConstraints={{
                                left: 0, right: 0
                            }}><img src={note?.backImgUrl} alt="Back solution Preview" />
                            <img src={note?.frontImgUrl} alt="Back problem Preview" /></motion.div>


                    </div>}
                </div>

                <div id="card-actions">


                    {/* {notes.length > 1 && <button id="card-skip-button"
                        onClick={prev}
                    >prev</button>}


                    <button id="card-flip-button"
                        onClick={handleFlip}
                    >{isFlipped ? 'see problem' : 'see solution'}</button>

                    <button id="card-next-button"
                        onClick={next}
                    >next</button> */}

                    {user == 'admin' && !message && <button id="card-delete-button"
                        onClick={() => { deleteNote() }}
                    >delete</button>}
                    {user == 'admin' && message && <div>{message}</div>}


                </div>
            </>






        }






    </div>;
}
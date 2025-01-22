import { fetchNotes } from '../firebase';
import { useEffect, useState } from 'react';


export const GetNotes = ({ course }) => {

    const [notes, setNotes] = useState([]);

    useEffect(() => {

        fetchNotes(course).then(data => {
            setNotes(data)
        })

        console.log(notes)

    }, [])


    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };


    return <div id="notes">


        {notes.length !== 0 &&


            <div
                className={`note-card ${isFlipped ? 'flipped' : ''}`}
                onClick={handleFlip}
            >
                {/* Front Side */}
                <div className="note-card-front">
                    <h2>Problem</h2>
                    <img src={notes[0]?.frontImgUrl} alt="Front Preview" />
                </div>

                {/* Back Side */}
                <div className="note-card-back">
                    <h2>Solution</h2>
                    <img src={notes[0]?.backImgUrl} alt="Back Preview" />
                </div>
            </div>



        }





    </div>;
}
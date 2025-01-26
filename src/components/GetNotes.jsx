import { fetchNotes } from '../firebase';
import { useEffect, useState } from 'react';


export const GetNotes = ({ course }) => {

    const [notes, setNotes] = useState([]);

    useEffect(() => {

        fetchNotes(course).then(data => {

            console.log(data)


            data.sort((a, b) => {
                // If ratings are the same, sort by newest date
                return new Date(b.created_at) - new Date(a.created_at);
            });

            setNotes(data)
        })

    }, [])


    const [isFlipped, setIsFlipped] = useState(false);
    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    let next=()=>{

    }

    let skip=()=>{
        
    }


    return <div id="notes">


        {notes.length !== 0 &&


            <div className='note-card-container'>
                <div id="card-actions">

                <button id="card-skip-button"
                        onClick={skip()}
                    >skip</button>

                    <button id="card-flip-button"
                        onClick={handleFlip}
                    >{isFlipped ? 'problem' : 'solution'}</button>

                    <button id="card-next-button"
                        onClick={next()}
                    >next</button>
                </div>

                <div
                    className={`note-card ${isFlipped ? 'flipped' : ''}`}
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
            </div>




        }

        {

notes.length == 0 &&<div id="notes">no cards</div>

        }





    </div>;
}
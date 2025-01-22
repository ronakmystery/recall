import { addNoteToFirestore, uploadImage } from '../firebase';
import {  useState } from 'react';


export const AddNote = ({course}) => {

  const [isFlipped, setIsFlipped] = useState(false);
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontFile, setFrontFile] = useState(null)
  const [backFile, setBackFile] = useState(null)

  const [message, setMessage] = useState(null)


  const handleImageChange = (e, side) => {

    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (file && file.size <= maxSize) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (side === 'front') {
          setFrontFile(file)
          setFrontImage(reader.result);
        } else {
          setBackFile(file)
          setBackImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setMessage("file bigger than 5MB")
      setTimeout(() => {
        setMessage(null)
        if (side === 'front') {
          setFrontImage(null);
        } else {
          setBackImage(null);
        }

      }, 1000)
    }
  };

  let addNote = async () => {


    if (!frontImage || !backImage) {
      alert("missing images.");
      return;
    }

    try {


      setMessage("uploading images...")
      const front = await uploadImage(frontFile, course);
      const back = await uploadImage(backFile, course);
      setMessage("saving note...")


      let note = {
        course,
        'backImgFileName': back.filename,
        'backImgUrl': back.url,
        'frontImgFileName': front.filename,
        'frontImgUrl': front.url,
        'reviews': {
          '5': 1
        }
      }

      const noteId = await addNoteToFirestore(note);
      setBackImage(null)
      setFrontImage(null)
      setIsFlipped(false)
      setFrontFile(null)
      setBackFile(null)

      setMessage("note added" + noteId)

      setTimeout(() => {
        setMessage(null)
      }, 1000);
    } catch (error) {
      console.log(error)
    }

  }


  return <div id="add-note">

    add note


    <div id="message">{message}</div>


    <div
      className={`note-card ${isFlipped ? 'flipped' : ''}`}
      onClick={handleFlip}
    >
      {/* Front Side */}
      <div className="note-card-front">
        <h2>Problem</h2>
        {frontImage ? (
          <img src={frontImage} alt="Front Preview" />
        ) : (
          <p>No image selected</p>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment" required
          onChange={(e) => handleImageChange(e, 'front')}
          onClick={(e) => e.stopPropagation()} // Prevent parent click

        />
      </div>

      {/* Back Side */}
      <div className="note-card-back">
        <h2>Solution</h2>
        {backImage ? (
          <img src={backImage} alt="Back Preview" />
        ) : (
          <p>No image selected</p>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment" required
          onChange={(e) => handleImageChange(e, 'back')}
          onClick={(e) => e.stopPropagation()} // Prevent parent click
        />
      </div>
    </div>


    <button onClick={() => addNote()}>add note</button>

  </div>;
}
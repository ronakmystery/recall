import { addNoteToFirestore, uploadImage } from '../firebase';
import { useState } from 'react';
import { useGlobalState } from '../GlobalContext';
import './AddNote.css'


export const AddNote = ({ course }) => {


  const [frontImage, setFrontImage] = useState(null);
  const [backImage, setBackImage] = useState(null);
  const [frontFile, setFrontFile] = useState(null)
  const [backFile, setBackFile] = useState(null)

  const [message, setMessage] = useState(null)

  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/Mobi|Android|iPhone|iPad/i.test(ua)) {
      return "phone";
    } else if (/Tablet|iPad/i.test(ua)) {
      return "tablet";
    } else {
      return "computer";
    }
  }


  const handleImageChange = (e, side) => {
    

    const file = e.target.files[0];
    const maxSize = 7 * 1024 * 1024; // 7 MB

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
      setMessage("file bigger than 7MB")
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
      }

      const noteId = await addNoteToFirestore(note);
      setMessage("note added")

      setTimeout(() => {
        setMessage(null)
        setBackImage(null)
        setFrontImage(null)
        setFrontFile(null)
        setBackFile(null)
      }, 1000);
    } catch (error) {
      console.log(error)
    }




  }

  const handlePaste = (event, side) => {

    setTimeout(() => {
      event.target.innerHTML = "paste image here";
    }, 100);

    const clipboardItems = event.clipboardData.items;

    for (const item of clipboardItems) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();

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

        break;
      }
    }
  };

  const { user, setUser } = useGlobalState();


  return <div id="add-note">

    {user == 'admin' && !message && <button
      id="upload"
      onClick={() => addNote()}>upload</button>}


    {message && <button id="message">{message}</button>}



    <div
    >
      {/* Front Side */}
      <div className="add-note add-note-card-front">
        <div>Problem</div>
        {frontImage ? (
          <img src={frontImage} alt="Front Preview" />
        ) : (
          <p
          >?</p>
        )}

        {
          getDeviceType() == 'computer' ? <div
            className="img-paste"
            contentEditable
            onPaste={(e) => handlePaste(e, 'front')}
          >paste image here</div> : <input
            onPaste={(e) => handlePaste(e, 'front')}
            type="file"
            accept="image/*"
            // capture="environment" required
            onChange={(e) => handleImageChange(e, 'front')}
            onClick={(e) => e.stopPropagation()} // Prevent parent click

          />

        }


      </div>


      {/* Back Side */}
      <div className="add-note add-note-card-back">
        <div>Solution</div>
        {backImage ? (
          <img src={backImage} alt="Back Preview" />
        ) : (
          <p

          >?</p>
        )}

        {
          getDeviceType() == 'computer' ? <div
            className="img-paste"
            contentEditable
            onPaste={(e) => handlePaste(e, 'back')}
          >paste image here</div> : <input
            type="file"
            accept="image/*"
            // capture="environment" required
            onChange={(e) => handleImageChange(e, 'back')}
            onClick={(e) => e.stopPropagation()} // Prevent parent click
          />

        }


      </div>
    </div>




  </div>;
}
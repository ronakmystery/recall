import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc, addDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
import { v4 as uuidv4 } from 'uuid'; // For generating unique filenames



const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};





const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();



export async function addCourseToFireStore(course) {
  try {
      const docRef = await addDoc(collection(db, "courses"), course);
      console.log("Course added with ID: ", docRef.id);
      return docRef.id;
  } catch (e) {
      console.error("Error adding course: ", e);
  }
}

export async function getCoursesFromFireStore() {
  const coursesCollection = collection(db, "courses/"); // Reference the "courses" collection

  try {
    const querySnapshot = await getDocs(coursesCollection); // Fetch all documents

    const courses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return courses
  } catch (error) {
    console.log(error)

  }

}



export async function firebaseGet(course) {
  const notesCollection = collection(db, `courses/${course}/notes`);

  try {
    const querySnapshot = await getDocs(notesCollection);

    if (querySnapshot.empty) {
      console.log("No notes found!");
      return [];
    }

    const notes = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    return [];
  }
}



export async function addNoteToFirestore(note) {

  const notesCollection = collection(db, `courses/${note.course}/notes`);

  try {
    const docRef = await addDoc(notesCollection, {
      ...note,
      created_at: new Date(),
    });

    console.log(`Document added with ID: ${docRef.id}`);
    return docRef.id
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}




export async function uploadImage(file, course) {
  const filename = `courses/${course}/${uuidv4()}_${file.name}`; // Unique filename with UUID

  try {
    // Create a reference to the storage location
    const storageRef = ref(storage, filename);

    // Upload the file
    console.log('uploading')
    const snapshot = await uploadBytes(storageRef, file);
    console.log("Uploaded image:", snapshot);

    // Get the download URL
    const url = await getDownloadURL(snapshot.ref);

    return { filename, url };
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}



export async function firebaseDelete(course, id) {
  try {
    const docRef = doc(db, `courses/${course}/notes/${id}`);
    const docSnap = await getDoc(docRef);

    const { frontImgFileName
      , backImgFileName } = docSnap.data();

    await deleteDoc(docRef);

    // Delete the front image
    const frontImageRef = ref(storage, frontImgFileName);
    await deleteObject(frontImageRef);
    console.log("Front image deleted successfully:", frontImgFileName);

    // Delete the back image
    const backImageRef = ref(storage, backImgFileName);
    await deleteObject(backImageRef);
    console.log("Back image deleted successfully:", backImgFileName);


    return true
  } catch (error) {
    console.log(error)
  }
}
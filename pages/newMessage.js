import { useState } from "react";
import { useRouter } from 'next/router'

const CreateNewMessage = () => {
    const [messageUser , setMessage] = useState('');
    const [ write, setWrite ] = useState(null)
    const router = useRouter();

    const writting = () => {
     setWrite("Writing...." + "." )
    }

    const savingFiles = () => {
        console.log("Triggered")
        const request = indexedDB.open("AtosDB", 1);
        let db;
        request.onerror = function(event) {
            console.log("Encounter an error inside the DB");
        }
        request.onsuccess = function(event) {
            db = request.result;
            const transaction = db.transaction('messages', 'readwrite');
            const store = transaction.objectStore('messages');
            store.put({ message: messageUser, time: Date.now()})
        }
        request.onupgradeneeded = function(event) {
            // Save the IDBDatabase interface
            const db = event.target.result;
            db.onerror = (event) => {
            console.log("This has been a mistake", event)
            }
            // Create an objectStore for this database
            const store = db.createObjectStore("messages", { autoIncrement : true });
            console.log(event, store)
        }
    }

    return ( 
        <div id="container-message-new" className="p-4">
            <h3 className="my-3">New | Entry</h3>
            <input value={messageUser} onInput={ (e) => { writting()  }} onChange={ (e) => { setMessage( e.target.value ) }} type="text-area" /> 
            {write && <div id="spinner-for-spin" className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>}
            <br />
            <button className="btn btn-primary my-4" onClick={ (e)=>{  router.push("/messages"); savingFiles(e); } } >Save</button>
        </div>
     );
}
 
export default CreateNewMessage;
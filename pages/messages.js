import { useEffect, useState } from "react";
import Cardmessage from "../components/CardMessage";

const ListAllMessages = () => {
    const [messages, setMessages] = useState(null);
 
    useEffect(()=> {
        const request = indexedDB.open("AtosDB", 1);
        let db;
        request.onerror = function(event) {
            console.log("Encounter an error inside the DB");
        }
        request.onsuccess = function(event) {
            db = event.target.result ;
            const transaction = db.transaction('messages', 'readwrite');
            const store = transaction.objectStore('messages');
            const query = store.getAll();
            query.onsuccess = function() {
                let queryMessages = [];
                query.result.forEach((e,i) => {
                    queryMessages[i] = [ e.message, e.time ]
                })
                let reversedArray = queryMessages.reverse();
                console.log(reversedArray)
                setMessages( reversedArray );
            }
        }
        request.onupgradeneeded = function(event) {
            // Save the IDBDatabase interface
            db = event.target.result;
            db.onerror = (event) => {
            console.log("This has been a mistake", event)
            }
            // Create an objectStore for this database
            const store = db.createObjectStore("messages", { autoIncrement : true });
            console.log(event, store)
        }

    }, [])
    
    return ( 
        <div className="p-4">
            { (messages === null) && <div id="spinner-for-teacher" className="spinner-border text-info" role="status">
                <span class="visually-hidden">Loading...</span>
            </div> }
            { (messages === null) ? <h1>Loading....</h1> : <h1 id="title-advancements-head">Advancements</h1>}
            <div>
                <Cardmessage messages={messages} />
            </div>
        </div>
     );
}
 
export default ListAllMessages;
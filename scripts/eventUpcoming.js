// var currentUser;               //points to the document of the user who is logged in
// firebase.auth().onAuthStateChanged(user => {
//     if (user) {
//         currentUser = db.collection("users").doc(user.uid)
//     }
// })

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("eventCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allEvents => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allEvents.forEach(doc => { //iterate thru each doc
                let code = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                let name = doc.data().name;       // get value of the "name" key
                let time = doc.data().day + " · " + doc.data().time + " " + doc.data().timezone;
                let rate = doc.data().rate;
                let attend = doc.data().attendees + " attendees · " + doc.data().remains + " spots remain";
                let details = doc.data().details;  // get value of the "details" key
                let docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-time').innerHTML = time;
                newcard.querySelector('.card-title').innerHTML = name;
                newcard.querySelector('.card-text').innerHTML = details;
                newcard.querySelector('.card-attend').innerHTML = attend;
                newcard.querySelector('.card-image').src = `./images/${code}.jpg`; //Example: NV01.jpg
                newcard.querySelector('a').href = "eachEvent.html?docID=" + docID;
                newcard.querySelector('.bookmark').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('.bookmark').onclick = () => bookmark(docID);
                element = newcard.querySelector('.card-rating');
                displayRate(element, rate);

                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).classList.replace("bi-bookmarks", "bi-bookmarks-fill");
                    }
                })

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

//-----------------------------------------------------------------------------
// This function is called whenever the user clicks on the "bookmark" icon.
// It adds the hike to the "bookmarks" array
// Then it will change the bookmark icon from the hollow to the solid version. 
//-----------------------------------------------------------------------------
function bookmark(eventDocID) {
    var iconID = 'save-' + eventDocID;
    var icon = document.getElementById(iconID);
    var updateField = icon.classList.contains("bi-bookmarks") ? 'arrayUnion' : 'arrayRemove';

    currentUser.update({
        bookmarks: firebase.firestore.FieldValue[updateField](eventDocID)
    })
        .then(function () {
            icon.classList.toggle("bi-bookmarks");
            icon.classList.toggle("bi-bookmarks-fill");
            var action = icon.classList.contains("bi-bookmarks") ? 'saved' : 'removed';
            console.log("Bookmark has been " + action + " for event " + eventDocID);
        })
        .catch(function (error) {
            console.error("Error updating bookmark:", error);
            // Display a user-friendly error message
            alert("An error occurred. Please try again later.");
        });
}

displayCardsDynamically("events");  //input param is the name of the collection


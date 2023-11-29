//----------------------------------------------------------
// This function is the only function that's called.
// This strategy gives us better control of the page.
//----------------------------------------------------------
function doAll() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            insertNameFromFirestore(user);
            getAttendingEvent(user)
        } else {
            console.log("No user is signed in");
        }
    });
}
doAll();

//----------------------------------------------------------
// This function takes input param User's Firestore document pointer
// and retrieves the "saved" array (of bookmarks) 
// and dynamically displays them in the gallery
//----------------------------------------------------------
function getAttendingEvent(user) {
    db.collection("users").doc(user.uid).get().then(userDoc => {
        // Get the Array of bookmarks
        var attending = userDoc.data().attending_events;
        // console.log(attending);

        // Get pointer the new card template
        let cardTemplate = document.getElementById("attendingCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

        // Iterate through the ARRAY of bookmarked hikes (document ID's)
        attending.forEach(thisEventID => {
            // console.log(thisEventID);
            db.collection("events").doc(thisEventID).get().then(doc => {  //iterate thru each doc
                var code = doc.data().code;    //get unique ID to each hike to be used for fetching right image
                var name = doc.data().name;       // get value of the "name" key
                var time = doc.data().day + " · " + doc.data().time + " " + doc.data().timezone;
                var rate = doc.data().rate;
                var attend = doc.data().attendees + " attendees · " + doc.data().remains + " spots remain";
                var details = doc.data().details;  // get value of the "details" key
                var docID = doc.id;
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

                currentUser.get().then(userDoc => {
                    //get the user name
                    var bookmarks = userDoc.data().bookmarks;
                    if (bookmarks.includes(docID)) {
                        document.getElementById('save-' + docID).classList.remove("bi-bookmarks");
                        document.getElementById('save-' + docID).classList.add("bi-bookmarks-fill");
                    }
                })

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //Finally, attach this new card to the gallery
                eventCardGroup.appendChild(newcard);
            })
        })
    })
}


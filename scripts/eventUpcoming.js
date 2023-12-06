//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("eventCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection called "hikes"
        .then(allEvents => {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allEvents.forEach(doc => { //iterate thru each doc
                let title = doc.data().title;       // get value of the "name" key
                let time = formatDate(doc.data().date) + " · " + formatTime(doc.data().time);
                let image = doc.data().image;
                // let rate = doc.data().rate;
                let attendee = doc.data().attendee + " attendees";
                let desc = doc.data().description;  // get value of the "details" key
                let docID = doc.id;
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                //update title and text and image
                newcard.querySelector('.card-time').innerHTML = time;
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-text').innerHTML = desc;
                newcard.querySelector('.card-attend').innerHTML = attendee;
                newcard.querySelector('.card-image').src = image; //Example: NV01.jpg
                newcard.querySelector('a').href = "eachEvent.html?docID=" + docID;
                newcard.querySelector('.bookmark').id = 'save-' + docID;   //guaranteed to be unique
                newcard.querySelector('.bookmark').onclick = () => bookmark(docID);
                // element = newcard.querySelector('.card-rating');
                // displayRate(element, rate);

                currentUser.get().then(userDoc => {
                    //get the user name
                    let bookmarks = userDoc.data().bookmarks;
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

displayCardsDynamically("events");  //input param is the name of the collection
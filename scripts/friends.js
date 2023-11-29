function displayFriendCardsDynamically(collection) {
    let cardTemplate = document.getElementById("friendCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 
    var currentUser;
    var userFriends;
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get().then(userDoc => {
                userFriends = userDoc.data().friends;

                db.collection(collection).get()   //the collection
                    .then(allUsers => {
                        // var i = 1;  //Optional: if you want to have a unique ID for each hike
                        allUsers.forEach(doc => { //iterate thru each 
                            if (userFriends.includes(doc.id)) {
                                var username = doc.data().name;       // get value of the "name" key
                                var title = doc.data().title;  // get value of the title key
                                var level = doc.data().level; //gets the score field
                                var profile = doc.data().profilePic;
                                var description = doc.data().description;
                                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                                var userID = doc.id;// grab id for specific activity

                                //update title and text and image
                                newcard.querySelector('.card-username').innerHTML = username;
                                newcard.querySelector('.card-userTitle').innerHTML = title;
                                newcard.querySelector('.card-description').innerHTML = description;
                                newcard.querySelector('.card-image').src = profile;
                                newcard.querySelector('.users-rank-badge').src = "images/Badges/Rank" + level + ".png"
                                // newcard.querySelector('a').href = ".html?docID="+docID;

                                //Optional: give unique ids to all elements for future use
                                // newcard.querySelector('a').setAttribute("id", "" + userID);
                                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                                //attach to gallery, Example: "hikes-go-here"
                                document.getElementById(collection + "-go-here").appendChild(newcard);

                                // i++;   //Optional: iterate variable to serve as unique ID
                            }
                        })
                    })
            })
        }
    })
}





displayFriendCardsDynamically("users")
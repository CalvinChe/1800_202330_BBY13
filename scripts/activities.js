var currentUser;
firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
        //go to the correct user document by referencing to the user uid
        currentUser = db.collection("users").doc(user.uid)
        //get the document for current user.
        currentUser.get()
    } else {
        console.log("error");
    }
})
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("activityCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection
        .then(allActivity => {
            // var i = 1;  //Optional: if you want to have a unique ID for each hike
            allActivity.forEach(doc => { //iterate thru each doc
                var title = doc.data().name;       // get value of the "name" key
                var description = doc.data().description;  // get value of the "details" key
                var daily = doc.data().daily;    //get value of daily key
                var score = doc.data().score; //gets the score field
                var evalue = doc.data().evalue; //gets evalue
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                var docID = doc.id;// grab id for specific activity

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-points').innerHTML = score + " points.";
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('.card-image').src = `./images/${doc.id}.png`; //Example: NV01.jpg
                // newcard.querySelector('a').href = ".html?docID="+docID;

                //Optional: give unique ids to all elements for future use
                newcard.querySelector('a').setAttribute("id", "" + title.toLowerCase());
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                // i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}

displayCardsDynamically("activity");  //input param is the name of the collection

function completeActivity(button) {
    var userPoints;
    var userEcoScore;
    var activityPts;
    var userLevel;
    button.className = "btn btn-primary card-href disabled" //change button class to include disabled
    var activityID = button.id
    console.log(activityID);
    db.collection('activity').doc(activityID).get().then((thisActivity => { // get the point value for the activity
        activityPts = thisActivity.data().score;
        // console.log(activityPts);
    }))
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get().then(userDoc => {
                userLevel = userDoc.data().level;
                userPoints = userDoc.data().points; // grab current points
                userEcoScore = userDoc.data().ecoScore // grab current ecoScore

                currentUser.update({
                    points: firebase.firestore.FieldValue.increment(activityPts), // increment user points by activity value
                    ecoScore: firebase.firestore.FieldValue.increment(activityPts), // increment user ecoScore
                    today: firebase.firestore.FieldValue.arrayUnion(activityID), // add completed activity to today array
                }).then(increaseLevel(userEcoScore, activityPts, userLevel, currentUser)) // call increase level function
            })
        }
    })
}


function increaseLevel(userEcoScore, activityPts, userLevel, currentUser) { // calculates if user has levelled up
    if (calculateUserLevel((userEcoScore + activityPts), userLevel) > userLevel) {
        currentUser.update({ // upsdates user level if necessary
            level: firebase.firestore.FieldValue.increment(1)
        }).then(setTimeout(redirectCongrats, 200)) // redirect to congrats page upon level up
    }
}

function redirectCongrats() {
    window.location.href = "levelCongrats.html";
}

function calculateUserLevel(exp, userLevel) { // calculates user level
    var levelXP;
    var expRequire = 0;
    for (let i = 1; i <= userLevel; i++) { // loop to get total xp needed currently
        levelXP = 10 * (1.1 ** (i - 1)) // calculation for dynamic level scaling
        expRequire += levelXP;
    }
    if (exp >= expRequire) {
        userLevel++ // increase user level
    }
    return userLevel;
}




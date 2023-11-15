const testUserID = "cNsDxf94TxsP8HOsH2IK";
var currentUser;
firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
        //go to the correct user document by referencing to the user uid
        currentUser = db.collection("users").doc(user.uid)
        //get the document for current user.
        currentUser.get()
        console.log(user.uid);
    } else {
        console.log("error");
    }
})
console.log(currentUser);
//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("activityCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection
        .then(allActivity=> {
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
    var newPoints;
    var activityPts;
    button.className="btn btn-primary card-href disabled"
    var activityID = button.id
    console.log(activityID);
    db.collection('activity').doc(activityID).get().then((thisActivity => {
        activityPts = thisActivity.data().score;
        console.log(activityPts);
    }))
    console.log(activityPts);
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            activityPoints = db.collection
            //get the document for current user.
            currentUser.get().then(userDoc => {
                // var userLevel = userDoc.data().level;
                userPoints = userDoc.data().points;
                newPoints = userPoints + activityPts;
                currentUser.update({
                    points: newPoints,
                    today: firebase.firestore.FieldValue.arrayUnion(activityID)
                })
            })
        }
    })   
    console.log(currentUser);
}

function calculateUserLevel(exp, currentLevel) {
     var expRequire = 100 * (1.1 ** currentLevel)
     if (exp >= expRequire) {
        userLevel++;
     }
}




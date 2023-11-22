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

function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("rewardsCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(collection).get()   //the collection
        .then(allRewards => {
            // var i = 1;  //Optional: if you want to have a unique ID for each hike
            allRewards.forEach(doc => { //iterate thru each doc
                var title = doc.data().title
                var description = doc.data().description;  // get value of the "details" key
                var cost = doc.data().cost;    //get value of daily key
                let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                var docID = doc.id;// grab id for specific activity

                //update title and text and image
                newcard.querySelector('.card-title').innerHTML = title;
                newcard.querySelector('.card-points').innerHTML = cost + " points.";
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('.card-image').src = `./images/rewards/${doc.id}.png`; //Example: NV01.jpg
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

displayCardsDynamically("rewards");  //input param is the name of the collection

function showPoints() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get().then(userDoc => {
                pointShow = userDoc.data().points;
                document.getElementById("points-card").innerHTML = ("<b>Current points: </b>" + pointShow);
            })
        }
    })
}

showPoints();


function checkReward(button) {
    var userPoints;
    var rewardCost;
    var rewardID = button.id

    db.collection('rewards').doc(rewardID).get().then((doc => {
        rewardCost = doc.data().cost;
    }))

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get().then(userDoc => {
                userPoints = userDoc.data().points;
                if (userPoints > rewardCost) {
                    currentUser.update({
                        points: firebase.firestore.FieldValue.increment(-rewardCost)
                        
                    }).then(setTimeout(showPoints, 500))
                    document.getElementById("redeemTitle").innerHTML = "Congratulations!";
                    document.getElementById("redeemContent").innerHTML = "Check your e-mail for redemption information.";
                } else {
                    document.getElementById("redeemTitle").innerHTML = "Oops!";
                    document.getElementById("redeemContent").innerHTML = "Come back again when you have enough points.";
                }
            })
        }
    })
}



function redeemReward() {

}
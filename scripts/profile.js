function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var ecoScore = userDoc.data().ecoScore;
                    var userLevel = userDoc.data().level;
                    var userDescription = userDoc.data().description;
                    var userTitle = userDoc.data().title;
                    var userProfilePic = userDoc.data().profilePic;
                    var userPoints = userDoc.data().points;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("userName").innerText = userName;
                    }
                    if (ecoScore != null) {
                        document.getElementById("ecoScore").innerText = ecoScore;
                    }
                    if (level != null) {
                        document.getElementById("level").innerText = userLevel;
                    }
                    if (points != null) {
                        document.getElementById("points").innerText = userPoints;
                    }

                    if (userDescription != null) {
                        document.getElementById("userDescription").innerText = userDescription;
                    }
                    if (userTitle != null) {
                        document.getElementById("userTitle").innerText = userTitle;
                    }
                    if (userProfilePic) {
                        let image = document.getElementById("userPic");
                        image.src = userProfilePic;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

function viewMoreInfo() {
    window.location.href = "profileEdit.html";
}

document.getElementById("twitter-share").onclick = function () {
    var userName;
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    userName = userDoc.data().name;
                    text = "Hi+my+name+is+" + userName +"%2C%0D%0AJoin+me+on+my+journey+to+be+more+eco-friendly%21%0A" + "https://comp1800-bby13-2023.web.app" 
                    location.href = "https://twitter.com/intent/tweet?text=" + text;
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
};

populateUserInfo();
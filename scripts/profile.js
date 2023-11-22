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

populateUserInfo();
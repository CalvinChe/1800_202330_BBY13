function sayHello() {

}
//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  firebase.auth().signOut().then(() => {
    // Sign-out successful.
    console.log("logging out user");
  }).catch((error) => {
    // An error happened.
  });
}
//sayHello();

var currentUser;               //points to the document of the user who is logged in
function displayUserProfilePictureAndLevel() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid)
      //get the document for current user.
      currentUser.get()
        .then(userDoc => {
          //get the data fields of the user
          var userProfilePic = userDoc.data().profilePic;
          var userLevel = userDoc.data().level;

          if (userProfilePic != null) {
            const image = document.getElementById("profilePic");
            image.src = userProfilePic;
          }

          if (userLevel != null) {
            document.getElementById("lvl").innerHTML = "Lvl " + userLevel;
          }
        })
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

displayUserProfilePictureAndLevel();


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

          if (userProfilePic) {
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

//
function updateLevelDynamically() {
  firebase.auth().onAuthStateChanged(user => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid)
      currentUser.onSnapshot((doc) => {
        console.log("current level: ", doc.data().level);
      });
    } else {
      // No user is signed in.
      console.log("No user is signed in");
    }
  });
}

// updateLevelDynamically();
displayUserProfilePictureAndLevel();

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

//----------------------------------------------------------
// Wouldn't it be nice to see the User's Name on this page?
// Let's do it!  (Thinking ahead:  This function can be carved out, 
// and put into script.js for other pages to use as well).
//----------------------------------------------------------//----------------------------------------------------------
function insertNameFromFirestore(user) {
  db.collection("users").doc(user.uid).get().then(userDoc => {
    // console.log(userDoc.data().name)
    userName = userDoc.data().name;
    // console.log(userName)
    document.getElementById("name-goes-here").innerHTML = userName;
  })
}

function displayRate(element, star) {
  // Calculate the number of full stars (integer part of star)
  const fullStars = Math.floor(star);
  const emptyStars = Math.floor(5 - star);
  // Check if there's a half-star (when the decimal part of star is not 0)
  const hasHalfStar = star % 1 !== 0;

  // Clear any previous rating icons
  element.innerHTML = '';

  // Create and append Bootstrap star icons based on the star rating
  for (let i = 0; i < 5; i++) {
    const starIcon = document.createElement("i");
    starIcon.classList.add("bi"); // Add Bootstrap classes for an empty star

    // Check if the current star should be filled (i < fullStars) or half-filled (i === fullStars and hasHalfStar is true)
    if (i < fullStars) {
      starIcon.classList.add("bi-star-fill"); // Add a class to fill the star
    } else if (i === fullStars && hasHalfStar) {
      starIcon.classList.add("bi-star-half"); // Add a class to fill the half-star
    } else {
      starIcon.classList.add("bi-star");
    }

    element.appendChild(starIcon);
  }
}
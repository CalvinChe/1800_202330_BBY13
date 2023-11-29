var currentUser;               //points to the document of the user who is logged in
function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userSchool = userDoc.data().school;
                    var userCity = userDoc.data().city;
                    var userCountry = userDoc.data().country;
                    var userDescription = userDoc.data().description;
                    var userTitle = userDoc.data().title;
                    var userPostalCode = userDoc.data().postalCode;
                    var userProfilePic = userDoc.data().profilePic;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userSchool != null) {
                        document.getElementById("schoolInput").value = userSchool;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userCountry != null) {
                        document.getElementById("countryInput").value = userCountry;
                    }
                    if (userDescription != null) {
                        document.getElementById("descriptionInput").value = userDescription;
                    }
                    if (userTitle != null) {
                        document.getElementById("titleInput").value = userTitle;
                    }
                    if (userPostalCode != null) {
                        document.getElementById("postalCodeInput").value = userPostalCode;
                    }
                    if (userProfilePic != null) {
                        const image = document.getElementById("mypic-goes-here");
                        image.src = userProfilePic;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
 }

function saveUserInfo() {
    var userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    var userSchool = document.getElementById('schoolInput').value;     //get the value of the field with id="schoolInput"
    var userCity = document.getElementById('cityInput').value;
    var userCountry = document.getElementById("countryInput").value;
    var userDescription = document.getElementById("descriptionInput").value;
    var userTitle = document.getElementById("titleInput").value;
    var userPostalCode = document.getElementById("postalCodeInput").value;
    var fileInput = document.getElementById("mypic-input");
    if (fileInput.value) {
        uploadPic(document.getElementById('nameInput').value);
    }
    currentUser.update({
        name: userName,
        school: userSchool,
        city: userCity,
        country: userCountry,
        description: userDescription,
        title: userTitle,
        postalCode: userPostalCode
    })
    .then(() => {
        // console.log("Document successfully updated!");
        setTimeout(function() { window.location.href = "profile.html" }, 500); // Redirect to the profile page. (causes image to not be uploaded properly)
    })
}

var ImageFile;
function listenFileSelect() {
      // listen for file selection
      var fileInput = document.getElementById("mypic-input"); // pointer #1
      const image = document.getElementById("mypic-goes-here"); // pointer #2

			// When a change happens to the File Chooser Input
      fileInput.addEventListener('change', function (e) {
          ImageFile = e.target.files[0];   //Global variable
          var blob = URL.createObjectURL(ImageFile);
          image.src = blob; // Display this image
      })
}
listenFileSelect();

//------------------------------------------------
// So, a new post document has just been added
// and it contains a bunch of fields.
// We want to store the image associated with this post,
// such that the image name is the postid (guaranteed unique).
// 
// This function is called AFTER the post has been created, 
// and we know the post's document id.
//------------------------------------------------
function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(ImageFile)   //global variable ImageFile
       
                   // AFTER .put() is done
        .then(function () {
            console.log('2. Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                 // AFTER .getDownloadURL is done
                .then(function (url) { // Get URL of the uploaded file
                    console.log("3. Got the download URL.");

                    // Now that the image is on Storage, we can go back to the
                    // post document, and update it with an "image" field
                    // that contains the url of where the picture is stored.
                    currentUser.update({
                            profilePic: url // Save the URL into users collection
                        })
                         // AFTER .update is done
                        .then(function () {
                            console.log('4. Added pic URL to Firestore.');
                        })
                })
        })
        .catch((error) => {
             console.log("error uploading to cloud storage");
        })
}



//call the function to run it 
populateUserInfo();
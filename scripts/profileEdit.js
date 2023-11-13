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
        console.log("Document successfully updated!");
    })

    document.getElementById('personalInfoFields').disabled = true;
}

//call the function to run it 
populateUserInfo();
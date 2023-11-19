let params = new URL(window.location.href); //get URL of search bar
let docID = params.searchParams.get("docID"); //get value for key "id"
console.log(docID);

function displayEventInfo() {
    // assign docID for eventSignup.html
    // document.querySelector('.eventSignup').href = "eventSignup.html?docID="+ID;
    db.collection("events").doc(docID).get()
        .then(doc => {
            thisEvent = doc.data();
            code = thisEvent.code;
            eventName = doc.data().name;
            // only populate title, and image
            document.getElementById("eventName").innerHTML = eventName;
            let imgEvent = document.querySelector(".event-img");
            imgEvent.src = "../images/" + code + ".jpg";

            hostName = doc.data().host;
            document.getElementById("hostName").innerHTML = hostName;
            let imgHost = document.querySelector(".host-img");
            imgHost.src = "../images/hosts/" + hostName + ".jpg";

            eventTime = doc.data().day + " · " + doc.data().time + " " + doc.data().timezone;
            document.getElementById("eventTime").innerHTML = eventTime;

            eventLocation = doc.data().address + " · " + doc.data().city + ", " + doc.data().province;
            document.getElementById("eventLocation").innerHTML = eventLocation;

            eventDetails = doc.data().details;
            document.getElementById("eventDetails").innerHTML = eventDetails;

            eventPrice = doc.data().price;
            document.getElementById("eventPrice").innerHTML = eventPrice;

            eventRemains = doc.data().remains;
            document.getElementById("eventRemains").innerHTML = eventRemains + " spots remain";

            let button = document.querySelector(".eventSignup");
            button.onclick = () => eventSignup();

            currentUser.get().then(userDoc => {
                let registed = userDoc.data().registed_events;
                if (registed.includes(docID)) {
                    button.innerHTML = "Registed";
                    button.classList.toggle("btn-danger");
                    button.classList.toggle("btn-secondary");
                }
            })
        });
}

function eventSignup() {
    let button = document.querySelector(".eventSignup");
    //check current color of button
    let bool = button.classList.contains("btn-danger");
    updateButtonState(button, bool);
    updateFirestore(bool);
}

//Return Original button if bool == false
function updateButtonState(button, bool) {
    let updateButton = bool ? "Registed" : "Request to Join";
    button.innerHTML = updateButton;

    button.classList.toggle("btn-danger");
    button.classList.toggle("btn-secondary");

    let action = bool ? 'registed' : 'unregisted';
    console.log("User has " + action + " for event " + docID);
}

//Remove event from firebase if bool == false
function updateFirestore(bool) {
    let updateField = bool ? 'arrayUnion' : 'arrayRemove';

    currentUser.update({
        registed_events: firebase.firestore.FieldValue[updateField](docID)
    })
        .catch(function (error) {
            console.error("Error updating event:", error);
            // Display a user-friendly error message
            alert("An error occurred. Please try again later.");
        });
}

displayEventInfo();


function eventSignup(eventDocID) {
    let button = document.getElementById("eventSignup");
    if (!button) {
        console.error("Button not found with ID: eventSignup");
        return;
    }

    let bool = button.classList.contains("active");
    let confirmMessage = "Confirm to " + (bool ? "unregister" : "register") + "?";

    if (confirm(confirmMessage)) {
        updateButtonState(button, bool);
        updateFirestore(eventDocID, bool);
    } else {
        // The user clicked "Cancel" in the confirmation dialog
        console.log("Toggle action canceled by the user.");
    }
}

function updateButtonState(button, bool) {
    let updateButton = bool ? "Request to Join" : "Registered";
    button.innerHTML = updateButton;
    button.classList.toggle("btn-danger");
}

function updateFirestore(eventDocID, bool) {
    var updateField = bool ? 'arrayRemove' : 'arrayUnion';

    currentUser.update({
        registered_events: firebase.firestore.FieldValue[updateField](eventDocID)
    })
        .then(function () {
            let action = bool ? 'unregistered' : 'registered';
            console.log("User has " + action + " for event " + eventDocID);
        })
        .catch(function (error) {
            console.error("Error updating event:", error);
            // Display a user-friendly error message
            alert("An error occurred. Please try again later.");
        });
}
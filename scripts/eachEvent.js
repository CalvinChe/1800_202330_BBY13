let params = new URL(window.location.href); //get URL of search bar
let docID = params.searchParams.get("docID"); //get value for key "id"
console.log(docID);

function displayEventInfo() {
    // assign docID for eventSignup.html
    // document.querySelector('.eventSignup').href = "eventSignup.html?docID="+ID;
    db.collection("events").doc(docID).get()
        .then(doc => {
            thisEvent = doc.data();

            let eventTitle = thisEvent.title;
            document.getElementById("eventTitle").innerHTML = eventTitle;


            host = db.collection("users").doc(thisEvent.host).get()
                .then(host => {
                    thisHost = host.data();
                    let hostImg = thisHost.profilePic;
                    document.getElementById("hostImg").src = hostImg;

                    let hostName = thisHost.name;
                    document.getElementById("hostName").innerHTML = hostName;
                })

            let eventDate = thisEvent.date;
            let eventTime = thisEvent.time;
            let eventDuration = thisEvent.duration;
            let { resultDate, resultTime } = addDurationToDateAndTime(eventDate, eventTime, eventDuration);
            document.getElementById("eventTime").innerHTML = formatDate(eventDate) + " at " + formatTime(eventTime) + " to<br>" + formatDate(resultDate) + " at " + formatTime(resultTime);

            let eventLocationX = thisEvent.locationX;
            let eventLocationAL = thisEvent.locationAL;
            document.getElementById("eventLocationX").innerHTML = eventLocationX;
            document.getElementById("eventLocationAL").innerHTML = formatAddress(eventLocationAL);
            let eventImg = thisEvent.image;
            document.getElementById("eventImg").src = eventImg;

            let eventDes = thisEvent.description;
            document.getElementById("eventDetails").innerHTML = eventDes;
            let eventContact = thisEvent.contact;
            document.getElementById("eventContact").innerHTML = eventContact;

            let eventFee = thisEvent.fee;
            document.getElementById("eventFee").innerHTML = "$" + eventFee;
            let eventAttendee = thisEvent.attendee;
            document.getElementById("eventAttendee").innerHTML = eventAttendee + " attendees";

            // eventRemains = doc.data().remains;
            // document.getElementById("eventRemains").innerHTML = eventRemains + " spots remain";

            let button = document.querySelector(".eventSignup");
            button.onclick = () => eventSignup();

            currentUser.get().then(userDoc => {
                let attending = userDoc.data().attending_events;
                if (attending.includes(docID)) {
                    button.innerHTML = "Requested";
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
    let updateButton = bool ? "Requested" : "Request to Join";
    button.innerHTML = updateButton;

    button.classList.toggle("btn-danger");
    button.classList.toggle("btn-secondary");

    let action = bool ? 'registered' : 'unregistered';
    console.log("User has " + action + " for event " + docID);
}

//Remove event from firebase if bool == false
function updateFirestore(bool) {
    let updateField = bool ? 'arrayUnion' : 'arrayRemove';

    currentUser.update({
        attending_events: firebase.firestore.FieldValue[updateField](docID)
    })
        .catch(function (error) {
            console.error("Error updating event:", error);
            // Display a user-friendly error message
            alert("An error occurred. Please try again later.");
        });
}

displayEventInfo();

function addDurationToDateAndTime(date, time, duration) {
    let dateTimeString = `${date}T${time}`;
    let startDateTime = new Date(dateTimeString);
    let resultDateTime = new Date(startDateTime.getTime() + duration * 60 * 60 * 1000);

    let resultDate = resultDateTime.toISOString().split('T')[0];
    let resultTime = resultDateTime.toISOString().split('T')[1].slice(0, 5);

    return { resultDate, resultTime };
}

function formatAddress(address) {
    // Split the address into components
    let parts = address.split(', ');

    // Extract the street and cityProvince
    let street = parts[0];
    let city = parts[1];
    let province = parts[2];

    // Format the address
    let formattedAddress = `${street} · ${city}, ${province}`;

    return formattedAddress;
}

function showMap() {
    //------------------------------------------
    // Defines and initiates basic mapbox data
    //------------------------------------------
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbWNoZW4zIiwiYSI6ImNsMGZyNWRtZzB2angzanBjcHVkNTQ2YncifQ.fTdfEXaQ70WoIFLZ2QaRmQ';
    const map = new mapboxgl.Map({
        container: 'map', // Container ID
        style: 'mapbox://styles/mapbox/streets-v11', // Styling URL
        center: [-122.964274, 49.236082], // Starting position
        zoom: 8.8 // Starting zoom
    });

    // Add user controls to map (compass and zoom) to top left
    var nav = new mapboxgl.NavigationControl();
    map.addControl(nav, 'top-left');

    // declare some globally used variables
    var userLocationMarker;
    var searchLocationMarker;
    var userLocation;

    // Get the user's location
    navigator.geolocation.getCurrentPosition(function (position) {
        userLocation = [position.coords.longitude, position.coords.latitude];
        // console.log(userLocation);
        // console.log(searchLocation);

        // Add a marker to the map at the user's location
        userLocationMarker = new mapboxgl.Marker()
            .setLngLat(userLocation)
            .addTo(map);

        // Center the map on the user's location
        map.flyTo({
            center: userLocation
        });
    });

    // Add the MapboxGeocoder search box to the map
    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        types: 'country,region,place,postcode,locality,neighborhood,address',
        mapboxgl: mapboxgl
    });

    // Listen for the 'result' event from the geocoder (when a search is made)
    db.collection("events").doc(docID).get()
        .then(doc => {
            searchLocation = doc.data().location;
            // console.log(userLocation);
            // console.log(searchLocation);

            // Add a marker to the map at the search location
            searchLocationMarker && searchLocationMarker.remove(); // Remove the previous search marker if it exists
            searchLocationMarker = new mapboxgl.Marker({ color: 'red' })
                .setLngLat(searchLocation)
                .addTo(map);

            // Fit the map to include both the user's location and the search location
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend(userLocation);
            bounds.extend(searchLocation);

            map.fitBounds(bounds, {
                padding: {
                    top: 100,
                    bottom: 50,
                    left: 100,
                    right: 50
                } // Add some padding so that markers aren't at the edge or blocked
            });
        });
}

showMap();
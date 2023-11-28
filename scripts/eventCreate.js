let searchLocation;

function generateDurationOptions(maxHour) {
    let duration = document.getElementById("inputDuration");

    for (let i = 0; i < maxHour; i++) {
        let option = document.createElement('option');
        var display = i;
        option.value = display;
        option.text = display;
        duration.add(option);
    }

    let customOption = document.createElement('option');
    customOption.value = 'custom';
    customOption.text = 'Custom';
    duration.add(customOption);
}

generateDurationOptions(10);

function customDuration() {
    let duration = document.getElementById('inputDuration');
    let customInput = document.getElementById('customInputDuration');

    if (duration.value === 'custom') {
        // Show the custom input field
        customInput.style.display = 'block';
    } else {
        // Hide the custom input field
        customInput.style.display = 'none';
    }
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
        console.log(blob);
    })
}
listenFileSelect();

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
        console.log(userLocation);
        console.log(searchLocation);

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
    document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

    // Listen for the 'result' event from the geocoder (when a search is made)
    geocoder.on('result', function (e) {
        searchLocation = e.result.geometry.coordinates;
        console.log(userLocation);
        console.log(searchLocation);

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

function saveEvent() {
    alert("SAVE POST is triggered");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here. 
            let title = document.getElementById("inputTitle").value;
            let date = document.getElementById("inputDate").value;
            let time = document.getElementById("inputTime").value;
            let duration = document.getElementById("inputDuration").value;
            if (duration === "custom") {
                duration = document.getElementById("customInputDuration").value;
            }
            let desc = document.getElementById("inputDescription").value;
            let contact = document.getElementById("inputContact").value;
            let attendee = document.getElementById("inputAttendee").value;
            let fee = document.getElementById("inputFee").value;

            db.collection("events").add({
                host: user.uid,
                title: title,
                date: date,
                time: time,
                duration: duration,
                description: desc,
                location: searchLocation,
                contact: contact,
                attendee: attendee,
                fee: fee,
                last_updated: firebase.firestore.FieldValue
                    .serverTimestamp() //current system time
            }).then(doc => {
                console.log("1. Post document added!");
                console.log(doc.id);
                uploadPic(doc.id);
            })
        } else {
            // No user is signed in.
            console.log("Error, no user signed in");
        }
    });
}

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
                    db.collection("events").doc(postDocID).update({
                        "image": url // Save the URL into users collection
                    })
                        // AFTER .update is done
                        .then(function () {
                            console.log('4. Added pic URL to Firestore.');
                            // One last thing to do:
                            // save this postID into an array for the OWNER
                            // so we can show "my posts" in the future
                            savePostIDforUser(postDocID);
                        })
                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}
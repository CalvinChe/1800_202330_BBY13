function displayEventInfo() {
    let params = new URL( window.location.href ); //get URL of search bar
    let ID = params.searchParams.get( "docID" ); //get value for key "id"
    console.log( ID );

    // assign docID for eventSignup.html
    document.querySelector('.eventSignup').href = "eventSignup.html?docID="+ID;

    // doublecheck: is your collection called "Reviews" or "reviews"?
    db.collection( "events" )
        .doc( ID )
        .get()
        .then( doc => {
            thisEvent = doc.data();
            code = thisEvent.code;
            eventName = doc.data().name;
            // only populate title, and image
            document.getElementById( "eventName" ).innerHTML = eventName;
            let imgEvent = document.querySelector( ".event-img" );
            imgEvent.src = "../images/" + code + ".jpg";

            hostName = doc.data().host;
            document.getElementById( "hostName" ).innerHTML = hostName;
            let imgHost = document.querySelector( ".host-img" );
            imgHost.src = "../images/hosts/" + hostName + ".jpg";

            eventTime = doc.data().day + " · " + doc.data().time + " " + doc.data().timezone;
            document.getElementById( "eventTime" ).innerHTML = eventTime;

            eventLocation = doc.data().address + " · " + doc.data().city + ", " + doc.data().province;
            document.getElementById( "eventLocation").innerHTML = eventLocation;

            eventDetails = doc.data().details;
            document.getElementById( "eventDetails" ).innerHTML = eventDetails;

            eventPrice = doc.data().price;
            document.getElementById( "eventPrice").innerHTML = eventPrice;

            eventRemains = doc.data().remains;
            document.getElementById( "eventRemains" ).innerHTML = eventRemains + " spots remain";
        } );
}

displayEventInfo();
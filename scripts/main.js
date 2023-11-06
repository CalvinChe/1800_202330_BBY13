const testUserID = "cNsDxf94TxsP8HOsH2IK";
function displayScore() {
    currentUser = db.collection("users").doc(testUserID);
    currentUser.get().then(userDoc => {
        var userScore = userDoc.data().score;
        document.getElementById("userScore").innerText = userScore;
    });
}

function displayDailyQuest() {
    var activityRef = db.collection("activity");
    // Query for documents where "daily" is true
    activityRef.where("daily", "==", true).get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                document.getElementById("dailyQuest").innerText = doc.id;
            });
        });
}

function displayHistoryLoop() {
    let historyTemplate = document.getElementById("history-content");
    var userRef = db.collection("users");

    userRef.doc(testUserID).get().then(doc => {
        var history = doc.data().history;
        history.forEach(entry => {
            var date = entry.date.toDate();
            var month = date.toLocaleString('en-US', { month: 'short' });
            var day = date.getDate();
            var event = entry.event;
            let newHistory = historyTemplate.content.cloneNode(true);
            newHistory.querySelector("#history-date").innerHTML = month + " " + day;
            newHistory.querySelector("#history-activity").innerHTML = event;
            console.log("Event: " + entry.event);
            console.log("Date: " + entry.date.toDate());
            console.log(newHistory);
            document.getElementById("history-go-here").appendChild(newHistory);
        })
    })

}

// write a test user into database to use in profile and main page.
function writeTestUser() {
    // Log Example
    var logEntry1 = {
        event: "Ride a bike",
        date: firebase.firestore.Timestamp.fromDate(new Date("March 10, 2022"))
    };

    var logEntry2 = {
        event: "Recycled",
        date: firebase.firestore.Timestamp.fromDate(new Date("January 1, 2023"))
    };

    // User Example
    var userData = {
        name: "John Doe",
        email: "JohnDoe@John.com",
        country: "Canada",
        province: "BC",
        city: "Vancouver",
        score: 23,
        ecoScore: 21,
        today: [1234, 5678],
        daily: true,
        history: [logEntry1, logEntry2]
    };

    // Add user to database
    var userRef = db.collection("users");
    userRef.add(userData)
        .then(function () {
            console.log("User added successfully.");
        })
        .catch(function (error) {
            console.error("Error adding user", error);
        });
}

// add some example activities.
function createActivity() {
    const activityRef = db.collection("activity");
    activityRef.add({
        description: "Ride a bike",
        score: 3,
        evalue: 2,
        daily: true
    });

    activityRef.add({
        description: "Recycle",
        score: 3,
        evalue: 2,
        daily: false
    });
}

displayHistoryLoop();
displayDailyQuest();
displayScore();
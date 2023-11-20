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

const addBtn = document.getElementById("content-body");

function createParticle() {
    for (let i = 0; i < 25; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");
      particle.innerHTML = "<h1>&#11088</h1>";
      particle.style.left = Math.floor(Math.random() * 95)  + '%';
      particle.style.top = Math.floor(Math.random() * 110) -25 + '%';
      particle.addEventListener("animationend", function() {
        particle.remove();
      });
    addBtn.append(particle);
  }
}

addBtn.addEventListener("click", function() {
  createParticle();
});

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

function writeEvents() {
    //define a variable for the collection you want to create in Firestore to populate data
    var eventsRef = db.collection("events");

    eventsRef.add({
        code: "VAN01",
        name: "Fraser Estuary KBA Count - 2023",
        address: "Needs a location",
        city: "Vancouver",
        province: "BC",
        host: "Harvey D.",
        day: "Sunday, November 26, 2023",
        time: "7:40 AM",
        timezone: "PST",
        rate: 4.5,
        price: "Free",
        details: "The annual count of major bird species in the Fraser Estuary Key Biodiversity Area will take place from dawn to dusk on Sunday, November 26th.\nThis survey will follow the Birds Canada IBA Survey Protocol. Participants are divided into teams. Each team covers one or more survey areas (see map).\nMore eyes on a team is always better so you don't need to be an expert birder to be useful. However, the focus of this event is on getting a good count, so it's more suitable for birders with some experience who are able to identify most of the common waterfowl and raptor species in the Vancouver area. Participants must have binoculars. A spotting scope is very useful for identifying more distant birds.\nIf you're interested in participating, please contact Remi Torrenta of Birds Canada at rtorrenta@birdscanada.org for details on how to sign up.",
        total_spots: 20,
        attendees: 11,
        remains: 9,
        
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });

    eventsRef.add({
        code: "VAN02",
        name: "Meet New People & Remove Invasive Plants at Thurston Woods Trail in Port Moody!",
        address: "894 Cunningham Ln",
        city: "Port Moody",
        province: "BC",
        host: "Ashton K. and Andrea R.",
        day: "Saturday, November 18, 2023",
        time: "9:15 AM",
        timezone: "PST",
        rate: 4,
        price: "Free",
        details: "Care for a local trail & make new friends with the Lower Mainland Green Team & City of Port Moody!\nWe will be removing invasive plants including English Ivy and Himalayan blackberry along a beautiful trail in off Noons Creek Dr and Cunningham Ln in Port Moody! We will be restoring local habitat while also having fun and connecting with each other in nature. We will be working RAIN OR SHINE.\nAll ages, abilities & experience levels are welcome, bring your family & friends! NO EXPERIENCE NECESSARY. Gloves, tools, instruction & snacks provided!LAND ACKNOWLEDGEMENT\nThis activity is taking place on the traditional, ancestral and unceded territory of the kʷikʷəƛ̓əm, S’ólh Téméxw (Stó:lō), Qayqayt, and Coast Salish First Nations who have lived on and stewarded these lands since time immemorial, and continue to do so today. We are humbled to run our program on these lands.\nQUESTIONS?\nEmail ashton@greenteamscanada.ca",
        total_spots: 35,
        attendees: 23,
        remains: 12,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });

    eventsRef.add({
        code: "VAN03",
        name: "BLPA - Weedbusters (Fence Building)",
        address: "Burnaby Lake",
        city: "Burnaby",
        province: "BC",
        host: "Burnaby Lake Park A.",
        day: "Saturday, November 18, 2023",
        time: " 11:00 AM",
        timezone: "PST",
        rate: 4,
        price: "Free",
        details: "We are building a fence to protect the Wildflower Meadow!\nIf you would like to join, you MUST sign up on Eventbrite using the link below.\nhttps://www.eventbrite.ca/e/blpa-weedbusters-wildflower-meadow-registration-750443646147\nWe will be laying down cardboard/coffee bags over the grass and then covering it with dirt. Then we will spread a seed mix of wildflowers.\nMore details about the event are on Eventbrite",
        total_spots: 10,
        attendees: 3,
        remains: 7,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });

    eventsRef.add({
        code: "VAN04",
        name: "Permaculture Vancouver Monthly Meetup!",
        address: "McBride Park Fieldhouse",
        city: "Vancouver",
        province: "BC",
        host: "Ross M.",
        day: "Wednesday, November 15, 2023",
        time: "6:30 PM",
        timezone: "PST",
        rate: 5,
                price: "Free",
        details: "Village Vancouver West Community Potluck\npotluck @6:30\nworkshop @7:30pm\nAll attendees should also register on VanRec:\nhttps://anc.ca.apm.activecommunities.com/vancouver/activity/search?onlineSiteId=0&activity_select_param=2&activity_keyword=permaculture%20meetup&viewMode=list\nJoin us for a community meal and an educational topic. Optionally, please either bring your own dinner or something to share for the potluck, and plate or bowl, and cutlery. We'll have a community seed library present - pick up some free seeds for your garden, swap or donate seeds. Free. At McBride Park Fieldhouse (2049 Waterloo St, 4th and Waterloo.)\nKeep your eyes and tummy out for other monthly potlucks with Village Vancouver (Vancouver's Transition Town Hub). There are currently 2 monthly potlucks - West (@McBride Fieldhouse) and West End (@West End Community Centre, in conjunction with West Neighbourhood Food Network). Typically, a workshop or discussion follows the meal. We will also continue to hold occasional Eastside meetups in Strathcona.\nWe also hold community potlucks (or other shared community meals) once in awhile in other neighbourhoods, including Cedar Cottage, False Creek South, Grandview-Woodland, Marpole-Oakridge, Mount Pleasant, Strathcona, and West Point Grey.\nVillage Vancouver holds over 350 workshops, events, and activities a year. For more information, please visit or join: www.villagevancouver.ca or contact Ross Moster at ross@villagevancouver.ca.\nPermaculture is about creating sustainable human habitats. It's about taking the energy from the land and encouraging it to cycle back into the land, to reuse it as many times as possible before letting it go (out to the sea of entropy, where we can't use it any more) so for example, a piece of land receives sun, wind, and rain. If we catch those... and use them judiciously, we can make our garden grow, and feed animals who will poop and return that to the land, and pretty soon we have better soil, better food, some protection, and eventually something to build with.",
        total_spots: 15,
        attendees: 4,
        remains: 11,
        last_updated: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}

// Example usage:
// Call the function with the class name of elements you want to add stars to

// displayHistoryLoop();
displayDailyQuest();
// displayScore();
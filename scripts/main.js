function insertNameFromFirestore() {
  // Check if the user is logged in:
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log(user.uid); // Let's know who the logged-in user is by logging their UID
      currentUser = db.collection("users").doc(user.uid); // Go to the Firestore document of the user
      currentUser.get().then((userDoc) => {
        // Get the user name
        let userName = userDoc.data().name;
        console.log(userName);
        //$("#name-goes-here").text(userName); // jQuery
        document.getElementById("name-goes-here").innerText = userName;
      });
    } else {
      console.log("No user is logged in."); // Log a message when no user is logged in
    }
  });
}
insertNameFromFirestore();

// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name
function readQuote(day) {
  db.collection("quotes")
    .doc(day) //name of the collection and documents should matach excatly with what you have in Firestore
    .onSnapshot(
      (dayDoc) => {
        //arrow notation
        console.log("current document data: " + dayDoc.data()); //.data() returns data object
        document.getElementById("quote-goes-here").innerHTML = dayDoc.data().quote; //using javascript to display the data on the right place

        //Here are other ways to access key-value data fields
        //$('#quote-goes-here').text(dayDoc.data().quote);         //using jquery object dot notation
        //$("#quote-goes-here").text(dayDoc.data()["quote"]);      //using json object indexing
        //document.querySelector("#quote-goes-here").innerHTML = dayDoc.data().quote;
      },
      (error) => {
        console.log("Error calling onSnapshot", error);
      }
    );
}

readQuote("tuesday"); //calling the function

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("hikeCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable.

  db.collection(collection)
    .get() //the collection called "hikes"
    .then((allHikes) => {
      //var i = 1;  //Optional: if you want to have a unique ID for each hike
      allHikes.forEach((doc) => {
        //iterate thru each doc
        var title = doc.data().name; // get value of the "name" key
        var details = doc.data().details; // get value of the "details" key
        var hikeCode = doc.data().code; //get unique ID to each hike to be used for fetching right image
        var hikeLength = doc.data().length; //gets the length field
        var docID = doc.id;
        let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

        //update title and text and image
        newcard.querySelector(".card-title").innerHTML = title;
        newcard.querySelector(".card-length").innerHTML = hikeLength + "km";
        newcard.querySelector(".card-text").innerHTML = details;
        newcard.querySelector(".card-image").src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg
        newcard.querySelector("a").href = "eachHike.html?docID=" + docID;

        //Optional: give unique ids to all elements for future use
        // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
        // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
        // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

        //attach to gallery, Example: "hikes-go-here"
        document.getElementById(collection + "-go-here").appendChild(newcard);

        //i++;   //Optional: iterate variable to serve as unique ID
      });
    });
}

displayCardsDynamically("hikes"); //input param is the name of the collection

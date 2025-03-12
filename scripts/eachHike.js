function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("hikeCardTemplate"); // Retrieve the HTML element with the ID "hikeCardTemplate" and store it in the cardTemplate variable.
  const params = new URLSearchParams(document.location.search);
  const docID = params.get("docID");
  console.log("docID", docID);

  db.collection(collection)
    .get() //the collection called "hikes"
    .then((allHikes) => {
      const clickedHike = allHikes.docs.find((hike) => hike.id == docID);
      var title = clickedHike.data().name; // get value of the "name" key
      var details = clickedHike.data().details; // get value of the "details" key
      var hikeCode = clickedHike.data().code; //get unique ID to each hike to be used for fetching right image
      var hikeLength = clickedHike.data().length; //gets the length field
      let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

      //update title and text and image
      newcard.querySelector(".card-title").innerHTML = title;
      newcard.querySelector(".card-length").innerHTML = hikeLength + "km";
      newcard.querySelector(".card-text").innerHTML = details;
      newcard.querySelector(".card-image").src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg

      document.querySelector(".container").appendChild(newcard);
    });
}

displayCardsDynamically("hikes");

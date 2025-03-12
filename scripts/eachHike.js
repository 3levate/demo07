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
      // let newcard = cardTemplate.content.cloneNode(true);

      //update title and text and image
      // newcard.querySelector(".card-title").innerHTML = title;
      // newcard.querySelector(".card-length").innerHTP = hikeLength + "km";
      // newcard.querySelector(".card-text").innerHTML = details;
      // newcard.querySelector(".card-image").src = `./images/${hikeCode}.jpg`;

      // document.querySelector(".container").appendChild(newcard);
      document.getElementById("hikeName").textContent = title;
      document.getElementById("hike-image").src = `../images/${hikeCode}.jpg`;
    });
}

function saveHikeDocumentIDAndRedirect() {
  let params = new URL(window.location.href); //get the url from the search bar
  let ID = params.searchParams.get("docID");
  localStorage.setItem("hikeDocID", ID);
  window.location.href = "review.html";
}

function populateReviews() {
  console.log("test");
  let hikeCardTemplate = document.getElementById("reviewCardTemplate");
  let hikeCardGroup = document.getElementById("reviewCardGroup");

  let params = new URL(window.location.href); // Get the URL from the search bar
  let hikeID = params.searchParams.get("docID");

  // Double-check: is your collection called "Reviews" or "reviews"?
  db.collection("reviews")
    .where("hikeDocID", "==", hikeID)
    .get()
    .then((allReviews) => {
      reviews = allReviews.docs;
      console.log(reviews);
      reviews.forEach((doc) => {
        var title = doc.data().title;
        var level = doc.data().level;
        var season = doc.data().season;
        var description = doc.data().description;
        var flooded = doc.data().flooded;
        var scrambled = doc.data().scrambled;
        var time = doc.data().timestamp.toDate();
        var rating = doc.data().rating; // Get the rating value
        console.log(rating);

        console.log(time);

        let reviewCard = hikeCardTemplate.content.cloneNode(true);
        reviewCard.querySelector(".title").innerHTML = title;
        reviewCard.querySelector(".time").innerHTML = new Date(time).toLocaleString();
        reviewCard.querySelector(".level").innerHTML = `Level: ${level}`;
        reviewCard.querySelector(".season").innerHTML = `Season: ${season}`;
        reviewCard.querySelector(".scrambled").innerHTML = `Scrambled: ${scrambled}`;
        reviewCard.querySelector(".flooded").innerHTML = `Flooded: ${flooded}`;
        reviewCard.querySelector(".description").innerHTML = `Description: ${description}`;

        // Populate the star rating based on the rating value

        // Initialize an empty string to store the star rating HTML
        let starRating = "";
        // This loop runs from i=0 to i<rating, where 'rating' is a variable holding the rating value.
        for (let i = 0; i < rating; i++) {
          starRating += '<span class="material-icons">star</span>';
        }
        // After the first loop, this second loop runs from i=rating to i<5.
        for (let i = rating; i < 5; i++) {
          starRating += '<span class="material-icons">star_outline</span>';
        }
        reviewCard.querySelector(".star-rating").innerHTML = starRating;

        hikeCardGroup.appendChild(reviewCard);
      });
    });
}

populateReviews();

displayCardsDynamically("hikes");

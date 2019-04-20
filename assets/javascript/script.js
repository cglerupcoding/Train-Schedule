$(function() {
    console.log('running');
  });
  
  $( document ).ready(function() {
  
      // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAsSYM94CpLKjVeVJXoYpvNuPXkPpau-t0",
    authDomain: "train-schedule-6727e.firebaseapp.com",
    databaseURL: "https://train-schedule-6727e.firebaseio.com",
    projectId: "train-schedule-6727e",
    storageBucket: "train-schedule-6727e.appspot.com",
    messagingSenderId: "553214594329"
  };
          firebase.initializeApp(config);

    var database = firebase.database();
		$("#submit-button").on("click", function(event) {
			event.preventDefault();

			//Grabs user Input
			var input = $("input");
			var tName = $("#train-name").val().trim();
			var tDestination = $("#train-destination").val().trim();
			var tFirstTime = moment($("#train-first-time").val().trim(), "HH:mm");
			var tFrequency = parseInt($("#train-frequency").val().trim());

				if (tName.length === 0) {
				tName = "";
				$("#train-name").val("");
				$("#train-name").attr("class", "form-control is-invalid");
				$("#invalid-name").text("Please enter a Train name")
				}
				else {
						$("#train-name").attr("class", "form-control");
						$("#invalid-name").text("");
				}

				if (tDestination.length === 0) {
						tDestination = "";
						$("#train-destination").val("");
						$("#train-destination").attr("class", "form-control is-invalid");
						$("#invalid-destination").text("Please enter a destination");
						
				}
				else {
						$("#train-destination").attr("class", "form-control");
						$("#invalid-destination").text("");
				}

				if (Number.isInteger(tFrequency) === false) {
						$("#train-frequency").val("");
						$("#train-frequency").attr("class", "form-control is-invalid");
						$("#invalid-frequency").text("Please enter a valid frequency");
				}
				else {
						$("#train-frequency").attr("class", "form-control");
						$("#invalid-frequency").text("");
				}
		
			if (moment(tFirstTime).isValid() === false) {
				tFirstTime = "";
				$("#train-first-time").val("");
				$("#train-first-time").attr("class", "form-control is-invalid");
				$("#invalid-time").text("Please enter a valid time");

				return    
		}
		
		$("#train-first-time").attr("class", "form-control");
		$("#invalid-time").text("");

			//Creates local object for holding train data
			var newTrain = {
					name: tName,
					destination: tDestination,
					firstTime: tFirstTime.format("HH:mm"),
					frequency: tFrequency
			};
			$("#train-first-Time").attr("class", "form-group");
			
			$("#helpBlock").text("");


			//Code for pushing train data to Firebase
			database.ref().push(newTrain);

			console.log(newTrain.name);
			console.log(newTrain.destination);
			console.log(newTrain.firstTime);
			console.log(newTrain.frequency);

			//Clear all of text-boxes
			$("#train-name").val("");
			$("#train-destination").val("");
			$("#train-first-time").val("");
			$("#train-frequency").val("");

	});

	//Firebase watcher + initial loader
	database.ref().on("child_added", function(childSnapshot) {

			var tName = (childSnapshot.val().name);
			var tDestination = (childSnapshot.val().destination);
			var tFirstTime = (childSnapshot.val().firstTime)
			var tFrequency = (childSnapshot.val().frequency);
			

			var convertedTime = moment(tFirstTime, "HH:mm").subtract(1, "years");
			console.log(convertedTime);

			//Current Time
			var currentTime = moment();

			//Difference between the times
			var diffTime = moment().diff(moment(convertedTime), "minutes");
			console.log("Differennce in time: " + diffTime);

			//Time apart
			var tRemainder = diffTime % tFrequency;
			console.log(tRemainder);

			//Minutes Until Train
			var minutesAway = tFrequency - tRemainder;
			console.log("Minutes until train: " + minutesAway);

			//Next Train
			var nextArrival = moment().add(minutesAway, "minutes");
			console.log("Arrival time: " + moment(nextArrival).format("HH:mm"));


			//Create the new row
			var newRow = $("<tr>").append(
					$("<td>").text(tName),
					$("<td>").text(tDestination),
					$("<td>").text(tFrequency),
					$("<td>").text(nextArrival.format("HH:mm")),
					$("<td>").text(minutesAway)
			);

			//Append the new row to the table
			$("#full-table").append(newRow);
			})})

			// FOUND BUG DID NOT CLOSE OUT SCRIPTS PROPERLY
			// APP IS WORKING NOW
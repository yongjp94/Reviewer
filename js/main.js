// Initialize Parse app
Parse.initialize("8BQwTR4ptyHuZhQx1FR00dv2Dfzu6sOL8aO2uw6s", "fbhAf5WHjjmKFw1lEIRGEFiqf0Ruz41kkdizVfLA");

// Create a new sub-class of the Parse.Object, with name "Review"
var Review = Parse.Object.extend('Review');

// Click event when form is submitted
$('form').submit(function() {
    // if user has entered title, rating, and comment, update and save data
    if ($('#title').val() != '' && $('#rate').raty('score') != null && $('#comment') != '' && currentUser) {
        alert('You have successfully submitted a review!');
        // Create a new instance of your Review class 
        var review = new Review();

        // For each input element, set a property of your new instance equal to the input's value

        review.set({
            'title' : $('#title').val(),
            'rating' : $('#rate').raty('score'),
            'comment' : $('#comment').val(),
            'user': currentUser,
            'readers' : 0,
            'helpful' : 0
        })

        // After setting each property, save your new instance back to your database
        review.save(null, {
            success:getData
        })
    } else { // warn the user about necessary information
        alert('You must enter a title, rating, and comment! Also, check if you are signed in!');
    }
	return false
})

// Write a function to get data
var getData = function() {
	

	// Set up a new query for our Review class
	var query = new Parse.Query(Review)

	// Set a parameter for your query -- where the title property isn't missing
	query.notEqualTo('title', '')

	/* Execute the query using ".find".  When successful:
	    - Pass the returned data into your buildList function
	*/
	query.find({
		success:function(results) {
			buildList(results)
            displayStars(results)
		} 
	})
}





// A function to build your list
var buildList = function(data) {
	// Empty out your ordered list
	$('#list').empty()
    
	// Loop through your data, and pass each element to the addItem function
	data.forEach(function(d){
		addItem(d);
	})
}

// displays the stars that are not in the review writing stub
var displayStars = function(data) {
    var ratingTotal = 0;
    data.forEach(function(d) {
        drawStars(d);
        ratingTotal += d.get('rating');
    })
    
    // calculates the average rating of product
    var avgRating = (ratingTotal.toFixed(2) / data.length.toFixed(2));
    
    // Display average rating for product
    $('#average-rating').raty({
        readOnly: true,
        score: avgRating
    })
    
    console.log('Current Average Rating: ' + avgRating.toFixed(2));
}

// draws the review stars that are unmodifiable
var drawStars = function(item) {
    var objectid = '#' + item.id;
    console.log(objectid);
    $(objectid).raty({
        readOnly: true,
        score: item.get('rating')
    });
}


// This function takes in an item, adds it to the screen
var addItem = function(item) {
	// Get parameters (title, rating, comment) from the data item passed to the function
	var title = item.get('title')
	var rating = item.get('rating')
	var comment = item.get('comment')
    var id = item.id
    
	
	// creates html code for title, rating, and comment
	var reviewitem = $('<div class="container" id="review-item"><h4>' + title + '</h4><br/>' +
                       '<div id="' + id +'"></div><br/>' + 
                       '<p>' + comment + '</p><br />' +
                       '</div>')
    
	// Create buttons to allow users to delete a review / vote on it whether it was helpful or not
	var button = $('<button class="btn">DELETE</button>')
    var upVote = $('<button class="btn" type="button" id="helpful">Helpful</button>')
    var downVote = $('<button class="btn" type="button" id="unhelpful">Unhelpful</button><br />')
    
    var helpful = $('<br /> <span>' + item.get('helpful') +' out of ' + item.get('readers') + ' people found this review helpful!</span>')
	
    // indicates that user has clicked helpful button
    upVote.click(function() {
        helpfulReview(id,true);
        console.log('helpful clicked');
    });
    
    // indicates that user has clicked unhelpful button
    downVote.click(function() {
        helpfulReview(id,false);
        console.log('unhelpful clicked');
    });
    
	// Click function on the delete button to destroy the item, then re-call getData
	button.click(function() {
		item.destroy({
			success:getData
		})
	})

	// Append the buttons to the review stub
	reviewitem.append(button);
    reviewitem.append(upVote);
    reviewitem.append(downVote);
    reviewitem.append(helpful);
	$('#list').append(reviewitem)
}

// finds and increments appropriate helpful count, vote count based on id
var helpfulReview = function(id, helpful) {
    var query = new Parse.Query(Review)
    query.equalTo('objectId', id)
    query.find({
        success:function(result){
            result[0].increment('readers');
            if (helpful) {
                result[0].increment('helpful');
            }
            result[0].save();
            getData();
        }
    })
}
// Call your getData function when the page loads
getData()

// Initiate the rating ability of the review writing stub
$('#rate').raty();

// Initialize Parse app
Parse.initialize("8BQwTR4ptyHuZhQx1FR00dv2Dfzu6sOL8aO2uw6s", "fbhAf5WHjjmKFw1lEIRGEFiqf0Ruz41kkdizVfLA");

var currentUser;

$('#sign-up').submit(function() {
    // if user has entered title, rating, and comment, update and save data
    if ($('#username').val() != '' && $('#password').val() != '' && $('#email') != '') {
        // Create a new instance of your Review class 
        var user = new Parse.User();

        // For each input element, set a property of your new instance equal to the input's value

        user.set({
            'username' : $('#username').val(),
            'password' : $('#password').val(),
            'email' : $('#email').val()
        })

        // After setting each property, save your new instance back to your database
        user.signUp(null, {
            success: function(user) {
                // Hooray! Let them use the app now.
                alert('You have successfully signed up! Try logging in!');
                document.location.href = 'SignIn.html';
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    } else { // warn the user about necessary information
        alert('Did you forget to enter something? (username, password, email required)');
    }
	return false
})


$('#sign-in').submit(function() {
    var username = $('#username').val()
    var password = $('#password').val()
    Parse.User.logIn(username, password, {
        success: function(user) {
            // Do stuff after successful login.
            currentUser  = Parse.User.current();
            document.location.href = 'index.html';
        },
        error: function(user, error) {
            // The login failed. Check error to see why.
            alert('login fail')
        }
    });
})

$('#sign-out').click(function() {
    Parse.User.logOut();
    currentUser = Parse.User.current();
    document.location.href = 'index.html';
}) 


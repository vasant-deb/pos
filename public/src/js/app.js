

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(function() {
      console.log('SW registered');
    });
}


  
document.addEventListener('DOMContentLoaded', function(event) {
      let deferredPrompt;
      const installButton = document.getElementById('install-button');
      const fullscreenButton = document.getElementById('fullscreen-button');

      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent the browser's default install prompt
        e.preventDefault();
        
        // Store the event for later use
        deferredPrompt = e;

        // Show the install button
        installButton.style.display = 'block';
        
        // Handle the button click to initiate the installation
        installButton.addEventListener('click', () => {
          // Prompt the user to install the PWA
          deferredPrompt.prompt();
          
          // Wait for the user to respond to the prompt
          deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              // Installation was successful
              console.log('PWA installed successfully');
              installButton.style.display = 'none'; // Hide the install button
            } else {
              // Installation was declined
              console.log('PWA installation declined');
            }

            // Reset the deferredPrompt
            deferredPrompt = null;
          });
        });
      });

      // Full-screen button functionality (unchanged)
      fullscreenButton.addEventListener('click', function() {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
          document.documentElement.msRequestFullscreen();
        }
        localStorage.setItem('fullscreen', 'true');

      });

  // Trigger button click after 5 seconds
  setTimeout(function() {
    fullscreenButton.click();
    fullscreenButton.style.display = 'none';

  }, 5000); // 5000 milliseconds = 5 seconds
});
$(document).ready(function() {
  $('#app-menu').hide();
  const userid=localStorage.getItem("userid");
  const token=localStorage.getItem("token");
  if(userid!=="" && token !=="" && userid!==undefined && token !==undefined && userid!==null && token !==null){

    $('#app-menu').show();
    $('#app-pin-wrapper').hide();
  }
  // When the button is clicked
  $("#toggleButton").click(function() {
    // Toggle the visibility of the content div
    $("#content").toggle();
  });
});

//here we go again
$(document).ready(function() {
  $('#loginForm').submit(function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get the user input values
    var userid = $('#userid').val();
    var password = $('#password').val();

    // Make an API call to authenticate the user
    $.ajax({
      type: 'POST', // Adjust the HTTP method as needed (e.g., POST, GET)
      url: 'https://pwa.onlinebilling.ca/login', // Replace with your API endpoint for user authentication
      data: {
        userid: userid,
        password: password
      },
      success: function(response) {
        // Check the response from the API
        if (response.error===false) {
          // Authentication successful
          $('#loginStatus').text('Login successful.');
          $('#app-menu').show();
          $('#app-pin-wrapper').hide();
          
          // You can also store user-related data in localStorage, if needed.
          localStorage.setItem('userid', userid);
          localStorage.setItem('token', response.token); // Assuming the API provides an authentication token.
          
        } else {
          // Authentication failed
          console.log('not found');
          $('#loginStatus').text('Login failed. Please check your credentials.');
        }
      },
      error: function() {
        $('#loginStatus').text('An error occurred while attempting to log in.');
      }
    });
  }); 

  $("#logout").click(function() {
    // Toggle the visibility of the content div
   
    localStorage.clear();
    $('#app-menu').hide();
    $('#app-pin-wrapper').show();
    $('#loginForm').trigger('reset');
    $('#loginStatus').text('Logout successful.');
  });
});


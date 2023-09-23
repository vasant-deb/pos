     // Function to update the date and time in the "date" and "time" elements
     function updateDateTime() {
        // Get the current date and time
        const now = new Date();

        // Extract date components
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');

        // Extract time components
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');

        // Determine AM or PM
        const amOrPm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        const formattedHours = (hours % 12) || 12;

        // Format the date and time as MM/DD/YYYY and hh:mm:ss AM/PM
        const formattedDate = `${month}/${day}/${year}`;
        const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes}:${seconds} ${amOrPm}`;

        // Update the "date" and "time" elements with the formatted date and time
        document.getElementById("date").textContent = formattedDate;
        document.getElementById("time").textContent = formattedTime;
    }

    // Call the updateDateTime function initially to set the date and time
    updateDateTime();

    // Update the date and time every second (1000 milliseconds)
    setInterval(updateDateTime, 1000);

    function requestFullscreen() {
      
        const element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
    
      // Call the requestFullscreen function when the PWA loads
      window.addEventListener('load', requestFullscreen);
$(document).ready(function() {
  const apiUrl = 'https://picsum.photos/400';

  // Load a new random image
  function loadRandomImage() {
    $('#randomImage').attr('src', apiUrl + '?random=' + new Date().getTime());
  }

  // Load stored images from localStorage
  function loadAssignedImages() {
    const assignedImages = JSON.parse(localStorage.getItem('assignedImages')) || {};
    $('#imageList').empty();
    let emailCount = 0;
    for (const email in assignedImages) {
      emailCount++;
      const images = assignedImages[email];
      const listItem = $('<li>').append($('<strong>').text(email));
      images.forEach(image => {
        listItem.append($('<img>').attr('src', image));
      });
      listItem.append($('<div>').addClass('separator'));
      listItem.append($('<button>').addClass('reset').text('Reset').data('email', email));
      $('#imageList').append(listItem);
    }
    if (emailCount >= 2) {
      $('#clearAllButton').show();
    } else {
      $('#clearAllButton').hide();
    }
  }

  // Function to validate email address
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Assign the current image to an email address
  $('#assignForm').on('submit', function(event) {
    event.preventDefault();
    const email = $('#emailInput').val();
    const currentImage = $('#randomImage').attr('src');
    const emailError = $('#emailError');

    // Check for email validation
    if (!validateEmail(email)) {
      emailError.text('Please enter a valid email address.');
      emailError.show();
      return;
    } else {
      emailError.hide();
    }

    const assignedImages = JSON.parse(localStorage.getItem('assignedImages')) || {};

    if (!assignedImages[email]) {
      assignedImages[email] = [];
    }

    // Check if the image is already assigned to this email
    if (!assignedImages[email].includes(currentImage)) {
      assignedImages[email].push(currentImage);
      localStorage.setItem('assignedImages', JSON.stringify(assignedImages));
      loadAssignedImages();
      emailError.hide(); 
    } else {
      emailError.text('This image is already assigned to this email.');
      emailError.show();
    }
  });

  // Reset images for a specific email
  $(document).on('click', '.reset', function() {
    const email = $(this).data('email');
    const assignedImages = JSON.parse(localStorage.getItem('assignedImages')) || {};
    delete assignedImages[email];
    localStorage.setItem('assignedImages', JSON.stringify(assignedImages));
    loadAssignedImages();
  });

  // Clear all assigned images
  $('#clearAllButton').on('click', function() {
    localStorage.removeItem('assignedImages');
    loadAssignedImages();
  });

  // Load a new image when "New Image" button is clicked
  $('#newImageButton').on('click', function() {
    loadRandomImage();
  });

  // Initial load
  loadRandomImage();
  loadAssignedImages();
});

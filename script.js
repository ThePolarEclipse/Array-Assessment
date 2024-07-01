$(document).ready(function() {
  const apiUrl = 'https://picsum.photos/400';

  // Load a new random image
  function loadRandomImage() {
    $('#randomImage').attr('src', apiUrl + '?random=' + new Date().getTime());
  }

  // Load stored images from localStorage.
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

  // Assign the current image to an email address
  $('#assignForm').on('submit', function(event) {
    event.preventDefault();
    const email = $('#emailInput').val();
    const assignedImages = JSON.parse(localStorage.getItem('assignedImages')) || {};
    
    if (!assignedImages[email]) {
      assignedImages[email] = [];
    }
    assignedImages[email].push($('#randomImage').attr('src'));
    localStorage.setItem('assignedImages', JSON.stringify(assignedImages));
    
    loadAssignedImages();
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

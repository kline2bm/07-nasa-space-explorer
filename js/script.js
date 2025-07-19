// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
setupDateInputs(startInput, endInput);

// Get references to other DOM elements
const button = document.querySelector('.filters button');
const gallery = document.getElementById('gallery');

// NASA APOD API key (use DEMO_KEY for testing)
const API_KEY = 'DEMO_KEY';

// Listen for button click to fetch images
button.addEventListener('click', () => {
  // Get the selected dates
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Ensure both dates are selected
  if (!startDate || !endDate) {
    alert('Please select both start and end dates.');
    return;
  }

  // Show loading message
  gallery.innerHTML = '<p>🔄 Loading space photos…</p>';

  // Build the API URL
  const url = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from NASA APOD API
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Clear the gallery before inserting new content
      gallery.innerHTML = '';

      // Loop through each item and render HTML only for images
      data.forEach(item => {
        if (item.media_type === 'image') {
          const imgDiv = document.createElement('div');
          imgDiv.className = 'apod-item';

          imgDiv.innerHTML = `
            <img src="${item.url}" alt="${item.title}" />
            <h3>${item.title}</h3>
            <p><strong>Date:</strong> ${item.date}</p>
          `;

          // Add click event to open a modal with more details
          imgDiv.addEventListener('click', () => openModal(item));

          // Add the image div to the gallery
          gallery.appendChild(imgDiv);
        }
      });
    })
    .catch(error => {
      // Show an error message if something goes wrong
      gallery.innerHTML = '<p>Sorry, something went wrong. Please try again later.</p>';
      console.error(error);
    });
});

// Function to create and display a modal
function openModal(item) {
  const modal = document.createElement('div');
  modal.className = 'modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const closeButton = document.createElement('span');
  closeButton.className = 'close-button';
  closeButton.innerHTML = '&times;';

  const modalImage = document.createElement('img');
  modalImage.src = item.url;
  modalImage.alt = item.title;

  const modalTitle = document.createElement('h2');
  modalTitle.textContent = item.title;

  const modalDate = document.createElement('p');
  modalDate.innerHTML = `<strong>Date:</strong> ${item.date}`;

  const modalExplanation = document.createElement('p');
  modalExplanation.textContent = item.explanation;

  // Append elements to modal content
  modalContent.appendChild(closeButton);
  modalContent.appendChild(modalImage);
  modalContent.appendChild(modalTitle);
  modalContent.appendChild(modalDate);
  modalContent.appendChild(modalExplanation);

  // Append modal content to modal
  modal.appendChild(modalContent);

  // Append modal to body
  document.body.appendChild(modal);

  // Add event listener to close the modal
  closeButton.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Close when clicking outside of the modal content
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });
}
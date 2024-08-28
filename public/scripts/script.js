
setTimeout(() => {
  const alertElement = document.querySelector('.alert');
  if (alertElement) {
      const alert = new bootstrap.Alert(alertElement);
      alert.close();
  }
}, 2000); 

//spinner
const spinnerContainer = document.getElementById('spinner-container');
window.addEventListener('load', function() {
  spinnerContainer.classList.add('d-none');
});

document.querySelectorAll('.masonry-item').forEach((card) => {
  const saveButton = card.querySelector('.save');
  const imgElement = card.querySelector('.show-img');
  
  card.addEventListener('mouseenter', () => {
    saveButton.classList.add('showit');
    imgElement.classList.add('bright');
  });
  
  card.addEventListener('mouseleave', () => {
    saveButton.classList.remove('showit');
    imgElement.classList.remove('bright');
  });
});

//profile image submit
const imageInput = document.getElementById('imageInput');
const imageForm = document.getElementById('imageForm');

imageInput.addEventListener('change', (event) => {
  imageForm.submit();
});


//alert



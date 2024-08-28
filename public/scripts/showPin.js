 let up = document.querySelector('.up');
    let down = document.querySelector('.down');
    let comments=document.querySelector('.comm')
    up.addEventListener('click',(event)=>{
      up.classList.add('d-none');
      down.classList.remove('d-none');
      comments.classList.remove('d-none');
    });
    down.addEventListener('click',(event)=>{
        down.classList.add('d-none');
        up.classList.remove('d-none');
        comments.classList.add('d-none');
    });

document.addEventListener('DOMContentLoaded', function() {
        const editButtons = document.querySelectorAll('.edit-btn');
    
        editButtons.forEach(button => {
          button.addEventListener('click', function(event) {
            event.preventDefault();
    
            // Hide all edit forms
            document.querySelectorAll('.edit-form').forEach(form => {
              form.classList.add('d-none');
            });
    
            // Show the edit form for the clicked comment
            const commentId = this.getAttribute('data-comment-id');
            const editForm = document.getElementById('edit-form-' + commentId);
            if (editForm) {
              editForm.classList.remove('d-none');
            }
          });
        });
      });
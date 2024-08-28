let created=document.querySelector('.created');
let saved=document.querySelector('.saved');
let createdPosts=document.querySelector('.created-posts');
let savedPosts=document.querySelector('.saved-posts');

created.addEventListener('click',(event)=>{
 created.classList.add('btn-dark');
 saved.classList.remove('btn-dark');
 createdPosts.classList.remove('d-none');
 savedPosts.classList.add('d-none');
});

saved.addEventListener('click',(event)=>{
 saved.classList.add('btn-dark');
 created.classList.remove('btn-dark');
 savedPosts.classList.remove('d-none');
 createdPosts.classList.add('d-none');
})
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Toggle Menu
const menuClick = $$('.menu-item');
const content   = $$('.wp');

menuClick.forEach(function(item, index) {
    item.addEventListener('click', function() {
        $('.menu-item.active').classList.remove('active');
        content.forEach(el => el.classList.remove('active'));
        this.classList.add('active');
        content[index].classList.add('active');        
    })
})

// Dark Mode

const darkMode = $('.dark-light');

darkMode.onclick = function() {
   this.classList.toggle('uil-sun');
   this.classList.toggle('uil-moon');
   const val = document.body.classList.toggle('dark');
   localStorage.setItem('dark', val);
}

if(localStorage.getItem('dark') == 'true') {
    document.body.classList.toggle('dark');
    darkMode.classList.toggle('uil-sun');
    darkMode.classList.toggle('uil-moon');

}

// function menuActive() {
   
//     const  menuLink = document.querySelectorAll('.menu-item');

//     menuLink.forEach(function (item) {
//        item.addEventListener('click', function (e) {
//             menuLink.forEach(el => el.classList.remove('active'))
//             e.target.classList.add('active');
//        })
//     })
// }
// menuActive();
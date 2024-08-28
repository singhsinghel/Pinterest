gsap.from('.masonry-item',{
    y:-100,
    duration:1,
    delay:1,
    stagger:"0.02",
    opacity:0
    
})
gsap.from('.pin',{
    duration:0.3,
    delay:0.3,
    opacity:0,
    scale:0.9,
})
gsap.from('.show-img',{
    x:"-100",
    y:100,
    duration:0.5,
    delay:0.3,
    opacity:0,
    scale:0.5
})

gsap.from('.info',{
    x:100,
    y:100,
    duration:0.5,
    delay:0.3,
    opacity:0,
    scale:0.2
})

gsap.from('.header',{
    opacity:0,
    duration:1,
    delay:1
})

// gsap.from('.heading',{
  
//    y:100,
//    duration:1,
//    opacity:0,
//    scrollTrigger:{
//     trigger:'.heading',
//     scroller:'body',
//     markers:true,
//     start:'top 5%',
    
//    }
// });

// gsap.from('.masonry-item',{
//     y:-10,
//     duration:1,
//     stagger:"0.02",
//     scrollTrigger:{
//        trigger:'.masonry-item',
//        scroller:'body',
//        scrub:1,
//        start:'top 20%'
//     }
// })
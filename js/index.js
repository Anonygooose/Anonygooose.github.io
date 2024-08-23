$(function(){
    $("#loader-placeholder").load("loader.html")
});

setTimeout(function(){
    let loadScreen = document.getElementById("loadContent");
    loadScreen.classList.add('fade-out');
}, 1000);

$(window).load(function(){ 
    $(function(){
        $("#nav-placeholder").load("navbar.html");
    });

    $(function(){
        $("#foot-placeholder").load("footer.html");
    });

    var $boxes = $('div.lazy');
    $boxes.hide();
  
    var $container = $('.grid');
    $container.imagesLoaded( function() {
      $boxes.fadeIn();
  
      $container.masonry({
        columnWidth: '.grid-sizer',
        itemSelector: '.grid-item',
        percentPosition: true,
      });    
    });
    
    setTimeout(function(){
        let loadScreen = document.getElementById("loadContent");
        loadScreen.style.zIndex = -2;
    }, 1500);
});
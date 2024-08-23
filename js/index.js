$(function(){
    $("#loader-placeholder").load("loader.html")
});

$(window).load(function(){ 
    $(function(){
        $("#nav-placeholder").load("navbar.html");
    });

    $(function(){
        $("#foot-placeholder").load("footer.html");
    });

    if(document.getElementById('loader-placeholder').innerHTML === "")
    {
        $(function(){
            $("#loader-placeholder").load("loader.html")
        });
    }

    var $boxes = $('div.lazy');
    $boxes.hide();
  
    var $container = $('.grid');
    $container.imagesLoaded( function() {
      $boxes.fadeIn();
  
      $container.masonry({
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.grid-sizer',
        // do not use .grid-sizer in layout
        itemSelector: '.grid-item',
        percentPosition: true,
      });    
    });

    setTimeout(function(){
        let loadScreen = document.getElementById("loadContent");
        loadScreen.classList.add('fade-out');
    }, 1000);

    
    setTimeout(function(){
        let loadScreen = document.getElementById("loadContent");
        loadScreen.style.zIndex = -2;
    }, 1500);
});
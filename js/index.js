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

    $(function(){
        $("#loader-placeholder").load("loader.html")
    });

    
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

    var coll = document.getElementsByClassName("whole-project");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.firstChild.nextElementSibling;

        if (content.nextElementSibling.style.maxHeight)
        {
          content.nextElementSibling.style.maxHeight = null;
          content.parentNode.style.height = "20vh";
        } 
        
        else {
          content.nextElementSibling.style.maxHeight = content.nextElementSibling.scrollHeight + "px";
          content.parentNode.style.height = content.nextElementSibling.scrollHeight + content.scrollHeight + "px";
        }

      });
    }    

    setTimeout(function(){
        let loadScreen = document.getElementById("loadContent");
        loadScreen.classList.add('fade-out');
    }, 1000);

    
    setTimeout(function(){
        let loadScreen = document.getElementById("loadContent");
        loadScreen.style.zIndex = -2;
    }, 1500);
});
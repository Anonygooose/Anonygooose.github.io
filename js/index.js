window.onload = function () { 
    $(function(){
    $("#nav-placeholder").load("navbar.html");
    });

    $(function(){
    $("#foot-placeholder").load("footer.html");
    });

    $('.grid').masonry({
        // use outer width of grid-sizer for columnWidth
        columnWidth: '.grid-sizer',
        // do not use .grid-sizer in layout
        itemSelector: '.grid-item',
        percentPosition: true,
    });
};


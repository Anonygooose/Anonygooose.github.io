let base = document.location.origin;

$(function(){
    $("#loader-placeholder").load(`${base}/loader.html`)
});

$(window).load(function(){ 
    $(function(){
        $("#nav-placeholder").load(`${base}/navbar.html`);
    });

    $(function(){
        $("#foot-placeholder").load(`${base}/footer.html`);
    });

    $(function(){
        $("#loader-placeholder").load(`${base}/loader.html`)
    });

    var coll = document.getElementsByClassName("background-select");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() 
      {
        // Whole Project class
        var wholeProject = this.parentNode;
        wholeProject.classList.toggle("active");

        // Project Info class
        var content = wholeProject.firstChild.nextElementSibling;

        // Project class
        var body = content.nextElementSibling;


        if (body.style.maxHeight)
        {
          body.style.maxHeight = null;
          wholeProject.removeAttribute('style');

          content.scrollIntoView({behavior: "smooth", block: "center"});
        } 
        
        else {
          body.style.maxHeight = body.scrollHeight + "px";
          wholeProject.style.height = body.scrollHeight + content.scrollHeight + "px";
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

const loader = (e) =>
{
  
}
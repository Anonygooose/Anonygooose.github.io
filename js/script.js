document.addEventListener("DOMContentLoaded", function(event) { 

    // NAVBAR CODE TAKEN FROM https://dev.to/areeburrub/hide-navbar-as-scroll-down-in-less-than-10-lines-of-javascript-1i00

    var lastScrollTop; // This Varibale will store the top position

    navbar = document.getElementById('navbar'); // Get The NavBar

    window.addEventListener('scroll',function()
    {
        //on every scroll this funtion will be called
        
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        //This line will get the location on scroll
        
        if(scrollTop > lastScrollTop){ //if it will be greater than the previous
            navbar.style.top='-250px';
            //set the value to the negetive of height of navbar 
        }
        
        else{
            navbar.style.top='0';
        }
        
        lastScrollTop = scrollTop; //New Position Stored
    });

    let original = document.querySelector("header").innerHTML;
    let list = document.querySelectorAll("img");

    document.querySelectorAll(".imgLink").forEach(button => {button.addEventListener("click", buttonClicked)});
    
    function buttonClicked() {
        
        for (let i = 0; i < list.length; i++)
        {
            if(list[i].classList.contains("getEnlarged"))
            {
                list[i].classList.remove("getEnlarged");
                if (list[i] == this.parentElement.querySelector("img"))
                {
                    return;
                }
            }
        }
        let imageElement = this.parentElement.querySelector("img");

        imageElement.classList.toggle("getEnlarged");
    }
});
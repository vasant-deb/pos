window.addEventListener("load", () => {
    const COMPONENT_SELECTOR = ".carousel__wrapper";
    const CONTROLS_SELECTOR = ".carousel__controls";
    const CONTENT_SELECTOR = ".carousel__content";
  
    const components = document.querySelectorAll(COMPONENT_SELECTOR);
  
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      const content = component.querySelector(CONTENT_SELECTOR);
      let x = 0;
      let mx = 0;
      const maxScrollWidth =
        content.scrollWidth - content.clientWidth / 2 - content.clientWidth / 2;
      const nextButton = component.querySelector(".arrow-next");
      const prevButton = component.querySelector(".arrow-prev");
  
      if (maxScrollWidth !== 0) {
        component.classList.add("has-arrows");
      }
  
      if (nextButton) {
        nextButton.addEventListener("click", function (event) {
          event.preventDefault();
          x = content.clientWidth / 2 + content.scrollLeft + 0;
          content.scroll({
            left: x,
            behavior: "smooth"
          });
        });
      }
  
      if (prevButton) {
        prevButton.addEventListener("click", function (event) {
          event.preventDefault();
          x = content.clientWidth / 2 - content.scrollLeft + 0;
          content.scroll({
            left: -x,
            behavior: "smooth"
          });
        });
      }
  
      /**
       * Mouse move handler.
       *
       * @param {object} e event object.
       */
      const mousemoveHandler = (e) => {
        const mx2 = e.pageX - content.offsetLeft;
        if (mx) {
          content.scrollLeft = content.sx + mx - mx2;
        }
      };
  
      /**
       * Mouse down handler.
       *
       * @param {object} e event object.
       */
      const mousedownHandler = (e) => {
        content.sx = content.scrollLeft;
        mx = e.pageX - content.offsetLeft;
        content.classList.add("dragging");
      };
  
      /**
       * Scroll handler.
       */
      const scrollHandler = () => {
        toggleArrows();
      };
  
      /**
       * Toggle arrow handler.
       */
      const toggleArrows = () => {
        if (content.scrollLeft > maxScrollWidth - 10) {
          nextButton.classList.add("disabled");
        } else if (content.scrollLeft < 10) {
          prevButton.classList.add("disabled");
        } else {
          nextButton.classList.remove("disabled");
          prevButton.classList.remove("disabled");
        }
      };
  
      /**
       * Mouse up handler.
       */
      const mouseupHandler = () => {
        mx = 0;
        content.classList.remove("dragging");
      };
  
      content.addEventListener("mousemove", mousemoveHandler);
      content.addEventListener("mousedown", mousedownHandler);
      if (component.querySelector(CONTROLS_SELECTOR) !== undefined) {
        content.addEventListener("scroll", scrollHandler);
      }
      content.addEventListener("mouseup", mouseupHandler);
      content.addEventListener("mouseleave", mouseupHandler);
    }
//calculatro
var two=document.getElementById('two');
two.addEventListener('click',function(){
    var body=document.querySelector('body');
    var toggle=document.getElementById('circle');
    body.classList.add('active1');
    body.classList.remove('active2');
    toggle.style.left='36%';
})
var one=document.getElementById('one');
one.addEventListener('click',function(){
    var body=document.querySelector('body');
    var toggle=document.getElementById('circle');
    body.classList.remove('active1');
    body.classList.remove('active2');
    toggle.style.left='0';
})
var three=document.getElementById('three');
three.addEventListener('click',function(){
    var body=document.querySelector('body');
    var toggle=document.getElementById('circle');
    body.classList.add('active2');
    body.classList.remove('active1');
    toggle.style.left='65%';
})



  });
  $(document).ready(function() {
    // Make an API call to authenticate the user
    $.ajax({
        type: 'GET', // Adjust the HTTP method as needed (e.g., POST, GET)
        url: 'https://pwa.onlinebilling.ca/categories', // Replace with your API endpoint for user authentication
        success: function(response) {
            // Check the response from the API
            if (response.error === false) {
                // Authentication successful
                var categories = response.categories;

                // Iterate through the categories and add them to the carousel
                $.each(categories, function(index, category) {
                    var carouselItem = '<li class="carousel__item">' +
                        '<a href="#">' +
                        '<div class="carousel__description">' +
                        '<h3 class="carousel__title">' + category.name + '</h3>' +
                        '</div></a></li>';

                    // Append the newly created carousel item to the ul
                    $('.mycategories').append(carouselItem);
                });
            } else {
                // Authentication failed
                console.log('Not found');
                $('#loginStatus').text('No Categories Found');
            }
        },
        error: function() {
            $('#loginStatus').text('An error occurred while attempting to log in.');
        }
    });

    $.ajax({
        type: 'GET', // Adjust the HTTP method as needed (e.g., POST, GET)
        url: 'https://pwa.onlinebilling.ca/default', // Replace with your API endpoint for user authentication
        success: function(response) {
            // Check the response from the API
            if (response.error === false) {
                // Authentication successful
                var defaultx = response.categories;
                var myproducts = response.products;
                // Iterate through the categories and add them to the carousel
                $.each(defaultx, function(index, category) {
                    var carouselItem = '<li class="carousel__item">' +
                        '<a href="#"><img class="carousel__item__image" src="https://api.1stopwireless.ca/public/uploads/categories/' + category.image + '" alt=""/>' +
                        '<div class="carousel__description">' +
                        '<h3 class="carousel__title">' + category.name + '</h3>' +
                        '</div></a></li>';

                    // Append the newly created carousel item to the ul
                    $('.mymodels').append(carouselItem);
                });


                $.each(myproducts, function(index, product) {
                    var carouselItem = '<li class="carousel__item">' +
                        '<a href="#"><img class="carousel__item__image" src="https://api.1stopwireless.ca/public/uploads/products/' + product.image + '" alt=""/>' +
                        '<div class="carousel__description">' +
                        '<h3 class="carousel__title">' + product.name + '</h3>' +
                        '</div></a></li>';

                    // Append the newly created carousel item to the ul
                    $('.myproduct').append(carouselItem);
                });


            } else {
                // Authentication failed
                console.log('Not found');
                $('#loginStatus').text('No Categories Found');
            }
        },
        error: function() {
            $('#loginStatus').text('An error occurred while attempting to log in.');
        }
    });
});
function viewcalculator(){
        //calculator
 var showcalc=document.getElementById('calc');
 showcalc.classList.add("show");

}
function closecalculator(){
    //calculator
var showcalc=document.getElementById('calc');
showcalc.classList.remove("show");

}
function del(){
    var value=document.getElementById('screen').value;
    document.getElementById('screen').value=value.substr(0,value.length-1);
}

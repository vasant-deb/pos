/* corousel start */
document.addEventListener("DOMContentLoaded", function() {
	const fullscreenButton = document.getElementById('fullscreen-button');

	// Make an API call to retrieve data
	$.ajax({
		type: 'GET',
		url: 'https://pwa.onlinebilling.ca/default',
		success: function(response) {
			if (response.error === false) {
				const categories = response.categories;
				const models = response.models;
				const products = response.products;

				// Create an array of slides for "categories" section
				const categorySlides = categories.map(category => {
					return `
                        <div class="swiper-slide" id="category${category.id}">
                            <h2>${category.name}</h2>
                        </div>
                    `;
				});

				// Add the "categories" slides to the carousel container
				$('#carousel-container').html(categorySlides.join(''));

				// Create an array of slides for "models" section
				const modelSlides = models.map(model => {
					return `
                        <div class="swiper-slide" id="model${model.id}">
                        <img class="proimage" src="https://api.1stopwireless.ca/public/uploads/categories/${model.image}"/>
                            <h2>${model.name}</h2>
                        </div>
                    `;
				});

				// Add the "models" slides to the carousel container
				$('#carousel-models').html(modelSlides.join(''));


				const productsPerPage = 8; // Number of products to show per page


				// Function to display products for a specific page
				function displayProducts(page) {
					const startIndex = (page - 1) * productsPerPage;
					const endIndex = startIndex + productsPerPage;
					const productSlidesx = products.slice(startIndex, endIndex).map(product => {
						return `
                            <div class="col-md-3 swiper-slide" id="product${product.id}">
                                <img class="proimage" src="https://api.1stopwireless.ca/public/uploads/products/${product.image}"/>
                                <h2>${product.name}</h2>
                            </div>
                        `;
					});

					// Add the "products" slides to the carousel container
					$('#carousel-productsx').html(productSlidesx.join(''));
                    de();
					
				}

				// Function to generate pagination links
				function generatePaginationLinks() {
					const totalPages = Math.ceil(products.length / productsPerPage);
					const $pagination = $('#pagination ul');
					$pagination.empty();

					for (let i = 1; i <= totalPages; i++) {
						const $li = $('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
						$li.click(function() {
							displayProducts(i);
							$li.addClass('active').siblings().removeClass('active');
						});
						$pagination.append($li);
					}

					// Show the first page by default
					displayProducts(1);
					$pagination.find('li:first-child').addClass('active');
				}

				// Sample product data (replace with your actual data)
				

				// Initialize pagination
				generatePaginationLinks();




				// Initialize Swiper for "categories" section
				const swiperCategories = new Swiper('.categories', {
					slidesPerView: 7, // Display 7 items at a time
					spaceBetween: 10, // Adjust the spacing between items
					navigation: {
						nextEl: '.nextxc',
						prevEl: '.prevxc',
					},
				});

				// Initialize Swiper for "models" section
				const swiperModels = new Swiper('.xmodels', {
					slidesPerView: 7, // Display 7 items at a time
					spaceBetween: 10, // Adjust the spacing between items
					navigation: {
						nextEl: '.nextxm',
						prevEl: '.prevxm',
					},
				});

				// Initialize Swiper for "products" section

				
			} else {
				console.log('Not found');
				$('#loginStatus').text('No Data Found');
			}
		},
		error: function() {
			$('#loginStatus').text('An error occurred while attempting to retrieve data.');
		}
	});

	function populateCustomerDropdown(customers) {
		const customerSelect = $('#customerSelect');

		// Clear existing options
		customerSelect.empty();

		// Add a default option
		customerSelect.append('<option>Select Customer</option>');

		// Add customer options
		customers.forEach(function(customer) {
			customerSelect.append(`<option value="${customer.id}">${customer.customerName}</option>`);
		});
	}

	function getusers() {
		// AJAX request to fetch customer data
		$.ajax({
			type: 'GET', // Adjust the HTTP method as needed
			url: 'https://pwa.onlinebilling.ca/getcustomers', // Replace with your server endpoint URL
			dataType: 'json', // Specify the expected data type
			success: function(response) {
				// Check if the response contains customer data
				if (response && response.customers) {
					const customers = response.customers;
					populateCustomerDropdown(customers);
				}
			},
			error: function() {
				console.error('Error fetching customer data.');
			}
		});
	}
	getusers();
	fullscreenButton.addEventListener('click', function() {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		}
	});




});

function errorotoast(title, message, type) {
	var errorSound = document.getElementById('errorSound');
	errorSound.play();
	const toasts = new Toasts({
		width: 300,
		timing: 'ease',
		duration: '0.5s',
		dimOld: false,
		position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
	});
	toasts.push({
		title: title,
		content: message,
		style: type
	});
}

function updatecart(action, pid, currentQuantity) {
	var clickSound = document.getElementById('clickSound');
	clickSound.play();
	// Get the input element for the current product
	var quantityInput = document.getElementById(`quantity${pid}`);
	const userid = localStorage.getItem('userid');
	// Parse the current quantity from the input
	var quantity = parseInt(quantityInput.value);

	// Check the action and update the quantity accordingly
	if (action === 'inc') {
		quantity++;
	} else if (action === 'dec' && quantity >= 0) { // Ensure quantity doesn't go negative
		quantity--;
	}

	if (action === 'del') {
		quantity = 0;
	}

	// Update the input field with the new quantity
	quantityInput.value = quantity;

	// You can also send the updated quantity to the server or perform other actions as needed
	// For example, you can use AJAX to update the cart on the server.
	// You can send 'pid' and 'quantity' to your 'updatecart' API endpoint.
	$.ajax({
		type: 'POST',
		url: 'https://pwa.onlinebilling.ca/updatecart',
		data: {
			pid: pid,
			quantity: quantity,
			userid: userid
		},
		success: function(response) {
			var newupdatedata = response.mydata;
			$('#invoice-table tbody').empty();
			// Assuming newupdatedata is an array of products
			var subtotal = 0; // Initialize subtotal
			sno = 1;
			newupdatedata.forEach(function(product) {
				var productName = product.product_name;
				var productPrice = product.discounted_price;
				var quantity = product.quantity;
				var pid = product.product_id;
				var sub = (productPrice * quantity).toFixed(2);

				// Add the current product's sub to the subtotal
				subtotal += parseFloat(sub);

				// Call the function to add the table row dynamically for each product
				addTableRow(productName, productPrice, quantity, pid, sub, sno);
				sno++;
			});

			// Calculate the HST (assuming 13% HST, you can adjust this as needed)
			var hst = (subtotal * 0.13).toFixed(2);

			// Calculate the total (subtotal + HST)
			var total = (parseFloat(subtotal) + parseFloat(hst) * 1.00).toFixed(2);

			// Add the subtotal row


			// Append the subtotal and HST rows to the table
			$('#putsubtotal').val(subtotal);
			$('#puthst').val(hst);
			$('#totalpayable').text(total);
		},
		error: function() {
			// Handle error
		}
	});
}


function addTableRow(productName, productPrice, quantity, pid, sub, sno) {

	var newRow = `
        <tr class="invoice-items">
            <td>${sno}</td>
            <td>${productName}<br>$ ${productPrice}</td>
            <td>
                <div class="quantity mycart${pid}" id="card">
                    <div role="group" class="input-group">
                        <div onclick="updatecart('dec',${pid},${quantity})" class="input-group-prepend"><span class="btn btn-primary btn-sm">-</span></div>
                        <input class="form-control" id="quantity${pid}"  name="quantity${pid}" type="number" value="${quantity}">
                        <div  onclick="updatecart('inc',${pid},${quantity})" class="input-group-append"><span class="btn btn-primary btn-sm">+</span></div>
                    </div>
                </div>
            </td>
            <td class="text-center">$ ${sub} <br>  <i onclick="updateitem(${pid})" class="fa fa-pencil"></i></td>
            <td>
          
            <i onclick="updatecart('del',${pid},'0')" class="fa fa-close text-danger"></i></td>
        </tr>
    `;

	// Append the new row to the table
	$('#invoice-table tbody').append(newRow);


}

function pay(modeofpayment) {
	const userid = localStorage.getItem('userid');

	var clickSound = document.getElementById('clickSound');
	clickSound.play();
	$.ajax({
		type: 'POST',
		url: 'https://pwa.onlinebilling.ca/checkout',
		data: {
			modeofpayment: modeofpayment,
			userid: userid,
		},
		success: function(response) {
			if (response.error === false) {
				var successSound = document.getElementById('successSound');
				successSound.play();
				const toasts = new Toasts({
					width: 300,
					timing: 'ease',
					duration: '0.5s',
					dimOld: false,
					position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
				});
				toasts.push({
					title: 'Success',
					content: 'Order Checkedout Successfully',
					style: 'success'
				});

				$('#invoice-table tbody').empty();
				$('#totalpayable').text('0.00');
			} else {
				// Authentication failed
				console.log('not found');

			}
		},
		error: function() {
			//   $('#loginStatus').text('An error occurred while attempting to log in.');
		}

	});

}

function desearch() {
	$('.searchproducts').on('click', function() {

		var clickSound = document.getElementById('clickSound');
		clickSound.play();
		// Get the id attribute of the clicked swiper-slide element
		var slideId = $(this).attr('id');
		var id = slideId.replace(/^[a-zA-Z]+/, ''); // Remove text from the beginning
		var type = slideId.replace(/\d+$/, ''); // Remove numbers from the end
		const userid = localStorage.getItem('userid');

		$.ajax({
			type: 'POST', // Adjust the HTTP method as needed (e.g., POST, GET)
			url: 'https://pwa.onlinebilling.ca/getdata', // Replace with your API endpoint for user authentication
			data: {
				type: type,
				id: id,
				userid: userid
			},
			success: function(response) {
				var newupdatedata = response.mydata;
				var type = response.type;
				if (type == "product") {

					$('#invoice-table tbody').empty();
					// Assuming newupdatedata is an array of products
					var subtotal = 0; // Initialize subtotal
					sno = 1;
					newupdatedata.forEach(function(product) {
						var productName = product.product_name;
						var productPrice = product.discounted_price;
						var quantity = product.quantity;
						var pid = product.product_id;
						var sub = (productPrice * quantity).toFixed(2);

						// Add the current product's sub to the subtotal
						subtotal += parseFloat(sub);

						// Call the function to add the table row dynamically for each product
						addTableRow(productName, productPrice, quantity, pid, sub, sno);
						sno++;
					});

					// Calculate the HST (assuming 13% HST, you can adjust this as needed)
					var hst = (subtotal * 0.13).toFixed(2);

					// Calculate the total (subtotal + HST)
					var total = (parseFloat(subtotal) + parseFloat(hst) * 1.00).toFixed(2);

					// Add the subtotal row

					// Append the subtotal and HST rows to the table
					$('#putsubtotal').val(subtotal);
					$('#puthst').val(hst);
					$('#totalpayable').text(total);

				} else {
					// Authentication failed
					console.log('not found');

				}
			},
			error: function() {
				//   $('#loginStatus').text('An error occurred while attempting to log in.');
			}
		});
	});

}
/* end corouse */
function de() {
	$('.swiper-slide').on('click', function() {

		var clickSound = document.getElementById('clickSound');
		clickSound.play();
		// Get the id attribute of the clicked swiper-slide element
		var slideId = $(this).attr('id');
		var id = slideId.replace(/^[a-zA-Z]+/, ''); // Remove text from the beginning
		var type = slideId.replace(/\d+$/, ''); // Remove numbers from the end
		const userid = localStorage.getItem('userid');
		// You can now use slideId as needed
		$.ajax({
			type: 'POST', // Adjust the HTTP method as needed (e.g., POST, GET)
			url: 'https://pwa.onlinebilling.ca/getdata', // Replace with your API endpoint for user authentication
			data: {
				type: type,
				id: id,
				userid: userid
			},
			success: function(response) {
				// Check the response from the API
				if (response.error === false) {
					var newupdatedata = response.mydata;
					var type = response.type;


					if (type == "category") {
						var modelSlides = newupdatedata.map(model => {
							return `
                        <div class="swiper-slide" id="model${model.id}">
                        <img class="proimage" src="https://api.1stopwireless.ca/public/uploads/categories/${model.image}"/>
                            <h2>${model.name}</h2>
                        </div>
                    `;
						});

						// Add the "models" slides to the carousel container
						$('#carousel-models').html(modelSlides.join(''));
						de();
					}
					if (type == "model") {

						const productsPerPage = 8; // Number of products to show per page


						// Function to display products for a specific page
						function displayProducts(page) {
							const startIndex = (page - 1) * productsPerPage;
							const endIndex = startIndex + productsPerPage;
							const productSlidesx = newupdatedata.slice(startIndex, endIndex).map(product => {
								return `
            <div class="col-md-3 swiper-slide" id="product${product.id}">
                <img class="proimage" src="https://api.1stopwireless.ca/public/uploads/products/${product.image}"/>
                <h2>${product.name}</h2>
            </div>
        `;
							});

							// Add the "products" slides to the carousel container
							$('#carousel-productsx').html(productSlidesx.join(''));
							de();

						}

						// Function to generate pagination links
						function generatePaginationLinks() {
							const totalPages = Math.ceil(newupdatedata.length / productsPerPage);
							const $pagination = $('#pagination ul');
							$pagination.empty();

							for (let i = 1; i <= totalPages; i++) {
								const $li = $('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
								$li.click(function() {
									displayProducts(i);
									$li.addClass('active').siblings().removeClass('active');
								});
								$pagination.append($li);
							}

							// Show the first page by default
							displayProducts(1);
							$pagination.find('li:first-child').addClass('active');

						}




						// Initialize pagination
						generatePaginationLinks();




					}
					if (type == "product") {

						$('#invoice-table tbody').empty();
						// Assuming newupdatedata is an array of products
						var subtotal = 0; // Initialize subtotal
						sno = 1;
						newupdatedata.forEach(function(product) {
							var productName = product.product_name;
							var productPrice = product.discounted_price;
							var quantity = product.quantity;
							var pid = product.product_id;
							var sub = (productPrice * quantity).toFixed(2);

							// Add the current product's sub to the subtotal
							subtotal += parseFloat(sub);

							// Call the function to add the table row dynamically for each product
							addTableRow(productName, productPrice, quantity, pid, sub, sno);
							sno++;
						});

						// Calculate the HST (assuming 13% HST, you can adjust this as needed)
						var hst = (subtotal * 0.13).toFixed(2);

						// Calculate the total (subtotal + HST)
						var total = (parseFloat(subtotal) + parseFloat(hst) * 1.00).toFixed(2);

						// Add the subtotal row

						// Append the subtotal and HST rows to the table
						$('#putsubtotal').val(subtotal);
						$('#puthst').val(hst);
						$('#totalpayable').text(total);

					}


				} else {
					// Authentication failed
					console.log('not found');

				}
			},
			error: function() {
				//   $('#loginStatus').text('An error occurred while attempting to log in.');
			}
		});


	});
	// Initialize Swiper (you should use your own swiper initialization code)
}
//reset call
$('#reset').on('click', function() {
	var clickSound = document.getElementById('clickSound');
	clickSound.play();
	// Get the id attribute of the clicked swiper-slide element
	const userid = localStorage.getItem('userid');
	// You can now use slideId as needed
	$.ajax({
		type: 'POST', // Adjust the HTTP method as needed (e.g., POST, GET)
		url: 'https://pwa.onlinebilling.ca/clearcart', // Replace with your API endpoint for user authentication
		data: {
			userid: userid
		},
		success: function(response) {
			const toasts = new Toasts({
				width: 300,
				timing: 'ease',
				duration: '0.5s',
				dimOld: false,
				position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
			});
			toasts.push({
				title: 'Reset',
				content: 'Clear Items Successfully',
				style: 'success'
			});

			$('#invoice-table tbody').empty();
			$('#totalpayable').text('0.00');
			$('#puthst').val('0.00');
			$('#putsubtotal').val('0.00');
			$('#putdiscount').val('0.00');
		},
		error: function() {
			// $('#loginStatus').text('An error occurred while attempting to log in.');
		}
	});


});
$('.popup').on('click', function(event) {
	if ($(event.target).is('.popup-close') || $(event.target).is('.popup')) {
		event.preventDefault();
		$('#generalform').hide();
	}
});
$('#general').on('click', function() {

	var clickSound = document.getElementById('clickSound');
	clickSound.play();
	// Get the id attribute of the clicked swiper-slide element
	$('#generalform').show();
});

// Listen for form submission
$('#generalpost').submit(function(e) {
	e.preventDefault(); // Prevent the default form submission

	// Get the form data
	// Get the form data
	var oldtotal = $('#totalpayable').text();
	var totalnew = $('#finalprice').val();
	const totalAmount = parseFloat(totalnew);
	const taxRate = 0.13; // 13% tax rate
	const subtotal = totalAmount / (1 + taxRate);
	const tax = totalAmount - subtotal;
	var discount = oldtotal - totalnew;

	$('#putdiscount').val(discount.toFixed(2));
	// Update the subtotal and tax in the HTML
	$('#putsubtotal').val(subtotal.toFixed(2));
	$('#puthst').val(tax.toFixed(2));
	$('#totalpayable').text(totalAmount.toFixed(2));
	$('#generalform').hide();
});
$('#updatefinal').on('click', function() {

	var clickSound = document.getElementById('clickSound');
	clickSound.play();
	// Get the id attribute of the clicked swiper-slide element
	var subtotal = $('#putsubtotal').val();
	var hst = $('#puthst').val();
	var discount = $('#putdiscount').val();
	var newtotal = parseFloat(subtotal) + parseFloat(hst) - parseFloat(discount) ;

	$('#totalpayable').text(newtotal.toFixed(2));
});



function search() {
	$('.searchresults').show();
	$('.hidesearch').hide();
	$('#back-button').show();
	$('#paginationx').show();



	var keyword = $('#searchkeyword').val();
	if (keyword == "") {
		errorotoast('Empty Field', 'Please Type Keyword to search', 'error');
	}
	$.ajax({
		type: 'POST', // Adjust the HTTP method as needed (e.g., POST, GET)
		url: 'https://pwa.onlinebilling.ca/search', // Replace with your API endpoint for user authentication
		data: {
			keywords: keyword
		},
		success: function(response) {
			if (response.error) {
				errorotoast('Search', response.message, 'error');
				die();
			} else {

				var products = response.data;
				var resultsContainer = $('#searchResultsContainer');

				// Clear previous search results
				resultsContainer.empty();



				const productsPerPage = 12; // Number of products to show per page


				// Function to display products for a specific page
				function displayProducts(page) {
					const startIndex = (page - 1) * productsPerPage;
					const endIndex = startIndex + productsPerPage;

					const productSlidesx = products.slice(startIndex, endIndex).map((product, index) => {
						const isLastInRow = (index + 1) % 5 === 0; // Check if this is the 4th item in the row

						const productCard = `
                            <div class="col-md-3 searchproducts card" id="product${product.id}">
                                <img class="proimage" src="https://api.1stopwireless.ca/public/uploads/products/${product.image}"/>
                                <h2>${product.name}</h2>
                            </div>
                        `;

						// Add the "clearfix" class after every 4th item
						if (isLastInRow) {
							return `<div class="clearfix"></div>`;
						} else {
							return productCard;
						}
					});
					// Add the "products" slides to the carousel container
					resultsContainer.html(productSlidesx.join(''));
					desearch();
				}

				// Function to generate pagination links
				function generatePaginationLinks() {
					const totalPages = Math.ceil(products.length / productsPerPage);
					const $pagination = $('#paginationx ul');
					$pagination.empty();

					for (let i = 1; i <= totalPages; i++) {
						const $li = $('<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>');
						$li.click(function() {
							displayProducts(i);
							$li.addClass('active').siblings().removeClass('active');
						});
						$pagination.append($li);
					}

					// Show the first page by default
					displayProducts(1);
					$pagination.find('li:first-child').addClass('active');
				}


				// Initialize pagination
				generatePaginationLinks();

				// Check if there are search results

			}
			//  $('#searchother').hide();
		},
		error: function() {
			// $('#loginStatus').text('An error occurred while attempting to log in.');
		}
	});
}

//end reset call
$('#userclose').on('click', function(event) {

	event.preventDefault();
	$('#userform').hide();

});
$('#openuseradd').on('click', function() {

	var clickSound = document.getElementById('clickSound');
	clickSound.play();
	// Get the id attribute of the clicked swiper-slide element
	$('#userform').show();
});

$('#manual').on('click', function() {

    var total=$('#totalpayable').text();
    if(total=="$ 0.00"){
        errorotoast('Empty Cart', 'Please Add Items in Cart', 'error');
    }else{

	var clickSound = document.getElementById('clickSound');
	clickSound.play();
	// Get the id attribute of the clicked swiper-slide element
	$('#manualform').show();
    $('#manualclose').hide();
    $('#amountleft').text(total);
    
}
});
$('#manualclose').on('click', function(event) {

	event.preventDefault();
	$('#manualform').hide();

});
// Initialize an empty array to store payment data
var payments = [];

$('#manualpost').submit(function (e) {
    e.preventDefault(); // Prevent the default form submission

    // Get the selected value from the select option with id "modeofpayment"
    var modeofpayment = $('#modeofpayment').val();

    // Get the current total
    var total = parseFloat($('#amountleft').text());

    // Get the entered amount
    var amount = parseFloat($('#amount').val());

    if (total === 0.00) {
      
        // Total is already paid, do nothing
        return;
    }

    if (amount <= 0 || isNaN(amount)) {
        // Amount entered is not valid, handle this as needed (e.g., show an error message)
        return;
    }

    if (amount > total) {
        // Amount entered is greater than the remaining total, set it to the total
        amount = total;
    }

    // Subtract the entered amount from the total
    total -= amount;

    // Add the payment data to the payments array
    payments.push({
        modeofpayment: modeofpayment,
        amount: amount.toFixed(2)
    });

    // Update the displayed total and amount left
    $('#amount').val('');
    $('#amountleft').text(total.toFixed(2));

    // Log the payments array (you can use it as needed)
    console.log(payments);

    if (total === 0.00) {
        const userid = localStorage.getItem('userid');
        var finaltotal=parseFloat($('#totalpayable').text()).toFixed(2);
        var finalsub=parseFloat($('#putsubtotal').val()).toFixed(2);
	    var finalhst=parseFloat($('#puthst').val()).toFixed(2);
        var finaldiscount=parseFloat($('#putdiscount').val()).toFixed(2);

        var customerid = $('#customerSelect').val();

// Check if a customer is selected
if (customerid !== 'Select Customer') {
    // Customer is selected, you can use the customerid
    console.log('Selected customerid:', customerid);
} else {
    // No customer is selected
    customerid='0';
}

        $.ajax({
            type: 'POST', // Adjust the HTTP method as needed (e.g., POST, GET)
            url: 'https://pwa.onlinebilling.ca/manualcheckout', // Replace with your API endpoint for user authentication
            data: {
                userid: userid,
                finaltotal:finaltotal,
                finalsub:finalsub,
                finalhst:finalhst,
                finaldiscount:finaldiscount,
                customerid:customerid,
                payments:JSON.stringify(payments)
            },
            success: function(response) {
                if (response.error === false) {
                    var successSound = document.getElementById('successSound');
                    successSound.play();
                    const toasts = new Toasts({
                        width: 300,
                        timing: 'ease',
                        duration: '0.5s',
                        dimOld: false,
                        position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
                    });
                    toasts.push({
                        title: 'Success',
                        content: 'Order Checkedout Successfully',
                        style: 'success'
                    });
    
                    $('#invoice-table tbody').empty();
                    $('#totalpayable').text('0.00');
                    
                    $('#putsubtotal').val(0.00);
                    $('#puthst').val(0.00);
                    $('#putdiscount').val(0.00);
                    $('#manualform').hide();
                } else {
                    // Authentication failed
                    console.log('not found');
    
                }
            },
            error: function() {
                // $('#loginStatus').text('An error occurred while attempting to log in.');
            }
        });


    }
});

$('#userpost').submit(function(e) {
	e.preventDefault(); // Prevent the default form submission

	// Get the form data
	// Get the form data
	var customerName = $('#cname').val();
	var street = $('#cstreet').val();
	var city = $('#ccity').val();
	var dob = $('#cdate').val();
	var email = $('#cemail').val();
	var phone = $('#cphone').val();

	$.ajax({
		type: 'POST', // Adjust the HTTP method as needed (e.g., POST, GET)
		url: 'https://pwa.onlinebilling.ca/addcustomer', // Replace with your API endpoint for user authentication
		data: {
			customerName: customerName,
			street: street,
			city: city,
			dob: dob,
			email: email,
			phone: phone
		},
		success: function(response) {
			if (response.error) {
				errorotoast('Customer', response.message, 'error');
			} else {
				const toasts = new Toasts({
					width: 300,
					timing: 'ease',
					duration: '0.5s',
					dimOld: false,
					position: 'top-right' // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
				});
				toasts.push({
					title: 'Customer',
					content: 'Customer Added Successfully',
					style: 'success'
				});

				getusers();
			}
			$('#userform').hide();
		},
		error: function() {
			// $('#loginStatus').text('An error occurred while attempting to log in.');
		}
	});



});
$('#back-button').on('click', function() {
	var resultsContainer = $('#searchResultsContainer');

	// Clear previous search results
	resultsContainer.empty();

	$('.hidesearch').show();
	$('.searchresults').hide();
	$('#back-button').hide();
	$('#paginationx').hide();

});
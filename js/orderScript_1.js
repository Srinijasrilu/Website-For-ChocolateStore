var proj4_data;
var cookieArray;
var handleArray;

$(document).ready( function(){

  proj4_data = new Array();
  var cart = new shopping_cart("jadrn050");
  var logo = $("[name='logo']");
  var errorLine = $("[name='error_line']");
  var cartNumber = $("[name='cart_number']");
  var checkoutButton = $("[name='checkout_button']");
  var submitOrderButton = $("[name='submit_order_button']");
  var cancelButton = $("[name='cancel_button']");
  var items = $("[name='items']");
  var totals = $("[name='totals']");
  var totalPrice;

  var firstName = $("[name='first_name']");
  var lastName = $("[name='last_name']");
  var address1 = $("[name='address1']");
  var address2 = $("[name='address2']");
  var city = $("[name='city']");
  var state = $("[name='state']");
  var zip = $("[name='zip']");
  var phone = $("[name='phone']");

  var firstNameBilling = $("[name='billing_first_name']");
  var lastNameBilling = $("[name='billing_last_name']");
  var address1Billing = $("[name='billing_address1']");
  var address2Billing = $("[name='billing_address2']");
  var cityBilling = $("[name='billing_city']");
  var stateBilling = $("[name='billing_state']");
  var zipBilling = $("[name='billing_zip']");
  var phoneBilling = $("[name='billing_phone']");

  var sameAsShippingButton = $("[name='same_as_shipping']");
  var ccType = $("[name='credit_cards']");
  var ccNumber = $("[name='cc_number']");
  var ccExp1 = $("[name='expiration1']");
  var ccExp2 = $("[name='expiration2']");

  var successDiv = $("[name='success']");

  handleArray = [firstName, lastName, address1, address2, city, state, zip, phone, firstNameBilling, lastNameBilling, address1Billing, address2Billing, cityBilling, stateBilling, zipBilling, phoneBilling, ccNumber, ccExp1, ccExp2];

  for(var i=0; i<handleArray.length; i++){
    handleArray[i].blur(function(){errorLine.html("");});
  }

  cookieArray = cart.getCartArray();
  cartNumber.html(cart.size());
  cancelButton.click(function(){ $("#dialog-modal").dialog('close');});
  submitOrderButton.click(function(){submitOrder();});
  sameAsShippingButton.click(function(){ sameAsShipping();});
  logo.click(function(){ window.location.href = "index.html";});

  $(document).on('click', '#change_quantity', function(){changeQuantity(this.name);});
  $(document).on('click', '#remove_item', function(){removeItem(this.name);});
  $(document).on('click', '#checkout_button', function(){showCheckout();});

  $( "#dialog-modal" ).dialog({
            height: 560,
            width: 850,
            resizable: false,
            modal: true,
            autoOpen: false
  });


  $.get('/perl/jadrn050/proj4/get_products.cgi', handleJson);

	function handleJson1(response){
		if(response == "invalid"){
			items.html("<h1>There was an error retrieving "+
			"product information from the server, Please try "+
			"again later</h1>");
			return;
		}
		proj4_data = eval("("+response+")");
		getContent();
		getTotals();
	}
	
	function handleJson(response) {
		if(response == "invalid"){
			items.html("<h1>There was an error retrieving "+
			"product information from the server, Please try "+
			"again later</h1>");
			return;
		}
		var tmpArray = explodeArray(response,';');
		for(var i=0; i < tmpArray.length; i++) {
			innerArray = explodeArray(tmpArray[i],'|');
			proj4_data[i] = innerArray;
        }
		getContent();
		getTotals();
    }   

  function getContent(){
    var str = "";
    for(var i=0; i<cookieArray.length; i++){
      var itemSku = cookieArray[i][0];

      for(var j=0; j<proj4_data.length; j++){
        if(itemSku == proj4_data[j][0]){

          str += "<div class=\"item_order\">";

          str += "<img src=\"/~jadrn000/PROJ4_IMAGES/"+proj4_data[j][0]+
            ".jpg\" alt=\""+proj4_data[j][2]+"\" width=\"100px\" " +
            "class=\"button1 item_picture\" name=\""+proj4_data[j][0]+"\" />";

          str += "<div class=\"checkout_description\">";
          str += proj4_data[j][2];
          str += "<p class=\"item_category\">in "+proj4_data[j][1]+"<br /><br /></p>";
          str += "<p>$"+proj4_data[j][6]+"</p>";
          str += "</div>";

          str += "<div class=\"checkout_quantities\">";
          str += "<span class=\"quantity_label\">Quantity</span>";
          str += "<input type=\"text\" id=\""+itemSku+"\" class=\"checkouts\" name=\"quantity\" value=\""+cookieArray[i][1]+"\" maxlength=\"3\" size=\"3\" /><br />";
          str += "<a href=\"javascript:;\" id=\"change_quantity\" name=\""+itemSku+"\">Update Quantity</a><br />";
          str += "<a href=\"javascript:;\" id=\"remove_item\" name=\""+itemSku+"\">Remove Item from Cart</a>";
          str += "</div>";

          str += "</div>";
          if(i != cookieArray.length-1){
            str += "<hr class=\"checkout\" />";
          }
        }
      }
    }

    if(cart.size() == 0){
      items.html("<div class=\"item_order\"><h1>Please visit the Products page<br />to add items to your cart</h1></div>");
    }
    else{
      items.html(str);
    }
  }

  function getConfirmationContent(){
    var str = "";
    for(var i=0; i<cookieArray.length; i++){
      var itemSku = cookieArray[i][0];

      for(var j=0; j<proj4_data.length; j++){
        if(itemSku == proj4_data[j][0]){

          str += "<div class=\"item_order\">";

          str += "<img src=\"/~jadrn000/PROJ4_IMAGES/"+proj4_data[j][0]+
            ".jpg\" alt=\""+proj4_data[j][2]+"\" width=\"100px\" " +
            "class=\"button1 item_picture\" name=\""+proj4_data[j][0]+"\" />";

          str += "<div class=\"checkout_description\">";
          str += proj4_data[j][2];
          str += "<p class=\"item_category\">in "+proj4_data[j][1]+"<br /><br /></p>";
          str += "<p>$"+proj4_data[j][6]+"</p>";
          str += "</div>";

          str += "<div class=\"checkout_quantities\">";
          str += "<span class=\"quantity_label\">Quantity:&nbsp;&nbsp;"+cookieArray[i][1]+"</span>";
          str += "</div>";

          str += "</div>";
          if(i != cookieArray.length-1){
            str += "<hr class=\"checkout\" />";
          }
        }
      }
    }

    items.html(str);
  }


  function getTotals(){
    var str = "";
    var tax = 0.0;
    totalPrice = 0;
    for(var i=0; i<cookieArray.length; i++){
      var itemSKU = cookieArray[i][0];
      var itemQuantity = parseInt(cookieArray[i][1]);

      for(var j=0; j<proj4_data.length; j++){
        if(proj4_data[j][0] == itemSKU){
          var itemPrice = parseFloat(proj4_data[j][6]) * itemQuantity;
          totalPrice += itemPrice;
        }
      } 
    } 
    tax = totalPrice * 0.08;

    var grandTotal;
    var strItemTotal = parseFloat(totalPrice.toFixed(2));
    var strTax = parseFloat(tax.toFixed(2));
    var strShipping = parseFloat("2.00");
    if(strItemTotal != 0.00){
      grandTotal = strItemTotal + strTax + strShipping;
    }
    else{
      grandTotal = strItemTotal + strTax;
    }

    if(strItemTotal != 0.00){
      str += "<div class=\"button2 total_divs\"><p class=\"totals\">$"+totalPrice.toFixed(2)+"</p><p class=\"totals\">$"+tax.toFixed(2)+"</p><p class=\"totals\">$2.00</p></div>";
    }
    else{
      str += "<div class=\"button2 total_divs\"><p class=\"totals\">$"+totalPrice.toFixed(2)+"</p><p class=\"totals\">$"+tax.toFixed(2)+"</p><p class=\"totals\">$0.00</p></div>";
    }
    str += "<div class=\"button2 total_divs1\"><p class=\"totals\">Item(s) Total:</p><p class=\"totals\">Tax:</p><p class=\"totals\">Shipping:</p></div>";
    str += "<div class=\"clear\"></div>";
    str += "<hr class=\"totals\" />";
    str += "<div class=\"button2 total_divs\"><p class=\"totals\">$"+grandTotal.toFixed(2)+"</p></div>";
    str += "<div class=\"button2 total_divs\"><p class=\"totals\">Total:</p></div>";
    str += "<div class=\"clear\"></div>";
    if(strItemTotal != 0.00){
      str += "<img src=\"./images/checkout.jpg\" id=\"checkout_button\" class=\"pointer button2 checkout_button\"alt= \"checkout button\" name=\"checkout_button\" width=\"185\" />";
	  str += "<br /><a href=\"products.html\" id=\"add_item_1\" >Continue shopping</a>";
    }

    totals.html(str);
  } // End of getTotals()


  function getConfirmationTotals(){
    var str = "";
    var tax = 0.0;
    totalPrice = 0;
    for(var i=0; i<cookieArray.length; i++){
      var itemSKU = cookieArray[i][0];
      var itemQuantity = parseInt(cookieArray[i][1]);

      for(var j=0; j<proj4_data.length; j++){
        if(proj4_data[j][0] == itemSKU){
          var itemPrice = parseFloat(proj4_data[j][6]) * itemQuantity;
          totalPrice += itemPrice;
        }
      } // End of j loop
    } // End of i loop
    tax = totalPrice * 0.08;

    var grandTotal;
    var strItemTotal = parseFloat(totalPrice.toFixed(2));
    var strTax = parseFloat(tax.toFixed(2));
    var strShipping = parseFloat("2.00");
    if(strItemTotal != 0.00){
      grandTotal = strItemTotal + strTax + strShipping;
    }
    else{
      grandTotal = strItemTotal + strTax;
    }

    if(strItemTotal != 0.00){
      str += "<div class=\"button2 total_divs\"><p class=\"totals\">$"+totalPrice.toFixed(2)+"</p><p class=\"totals\">$"+tax.toFixed(2)+"</p><p class=\"totals\">$2.00</p></div>";
    }
    else{
      str += "<div class=\"button2 total_divs\"><p class=\"totals\">$"+totalPrice.toFixed(2)+"</p><p class=\"totals\">$"+tax.toFixed(2)+"</p><p class=\"totals\">$0.00</p></div>";
    }
    str += "<div class=\"button2 total_divs\"><p class=\"totals\">Item(s) Total:</p><p class=\"totals\">Tax:</p><p class=\"totals\">Shipping:</p></div>";
    str += "<div class=\"clear\"></div>";
    str += "<hr class=\"totals\" />";
    str += "<div class=\"button2 total_divs\"><p class=\"totals\">$"+grandTotal.toFixed(2)+"</p></div>";
    str += "<div class=\"button2 total_divs\"><p class=\"totals\">Total:</p></div>";
    str += "<div class=\"clear\"></div>";

    totals.html(str);
  } // End of getConfirmationTotals()


  function changeQuantity(sku) {
    removeFocus();
    var quantityValue = $('#'+sku).val();
    if(quantityValue == "0"){
      removeItem(sku);
      return;
    }
    if(!isNumber(quantityValue)){
      alert("Quantity must be a number");
      $('#'+sku).focus();
      return;
    }
    cart.setQuantity(sku, quantityValue);
    cookieArray = cart.getCartArray();
    $('#'+sku).val(quantityValue);
    cartNumber.html(cart.size());
    getContent();
    getTotals();
  }


  function removeItem(sku) {
    cart.delete(sku);
    cookieArray = cart.getCartArray();
    cartNumber.html(cart.size());
    getContent();
    getTotals();
  }


  function removeFocus(){
    for(var i=0; i<cookieArray.length; i++){
      $('#'+cookieArray[i][0]).blur();
    }
  }

  function sameAsShipping(){
    if(sameAsShippingButton.is(":checked")){
      firstNameBilling.val(firstName.val());
      lastNameBilling.val(lastName.val());
      address1Billing.val(address1.val());
      address2Billing.val(address2.val());
      cityBilling.val(city.val());
      stateBilling.val(state.val());
      zipBilling.val(zip.val());
      phoneBilling.val(phone.val());
    }
    else{
      firstNameBilling.val("");
      lastNameBilling.val("");
      address1Billing.val("");
      address2Billing.val("");
      cityBilling.val("");
      stateBilling.val("");
      zipBilling.val("");
      phoneBilling.val("");
    }
  }


  function showCheckout(){

    removeFocus();

    for(var i=0; i<cookieArray.length; i++){
      if(!isNumber($('#'+cookieArray[i][0]).val())){
        alert("All quantities must be numbers =)");
        $('#'+cookieArray[i][0]).focus();
        return;
      }
    }

    firstNameBilling.val("");
    lastNameBilling.val("");
    address1Billing.val("");
    address2Billing.val("");
    cityBilling.val("");
    stateBilling.val("");
    zipBilling.val("");
    phoneBilling.val("");

    firstName.val("");
    lastName.val("");
    address1.val("");
    address2.val("");
    city.val("");
    state.val("");
    zip.val("");
    phone.val("");

    sameAsShippingButton.prop('checked', false);
    ccNumber.val("");
    ccExp1.val("");
    ccExp2.val("");

    $("#dialog-modal").dialog('open');
  }


  function submitOrder(){
    if(!isValidName(firstName.val())){
      errorLine.html("Shipping first name conatins invalid characters");
      firstName.focus();
      return;
    }
    if(isEmpty(firstName.val())){
      errorLine.html("Shipping first name is empty");
      firstName.focus();
      return;
    }
    if(!isValidName(firstNameBilling.val())){
      errorLine.html("Billing first name conatins invalid characters");
      firstNameBilling.focus();
      return;
    }
    if(isEmpty(firstNameBilling.val())){
      errorLine.html("Billing first name is empty");
      firstNameBilling.focus();
      return;
    }
    if(!isValidName(lastName.val())){
      errorLine.html("Shipping last name conatins invalid characters");
      lastName.focus();
      return;
    }
    if(isEmpty(lastName.val())){
      errorLine.html("Shipping last name is empty");
      lastName.focus();
      return;
    }
    if(isEmpty(lastNameBilling.val())){
      errorLine.html("Billing last name is empty");
      lastNameBilling.focus();
      return;
    }
    if(!isValidName(lastNameBilling.val())){
      errorLine.html("Billing last name conatins invalid characters");
      lastNameBilling.focus();
      return;
    }
    if(isEmpty(address1.val())){
      errorLine.html("Shipping address is empty");
      address1.focus();
      return;
    }
    if(!isValidAddress(address1.val())){
      errorLine.html("Shipping address contains invalid characters");
      address1.focus();
      return;
    }
    if(!isValidAddress(address2.val())){
      errorLine.html("Shipping address contains invalid characters");
      address2.focus();
      return;
    }
    if(isEmpty(address1Billing.val())){
      errorLine.html("Billing address is empty");
      address1Billing.focus();
      return;
    }
    if(!isValidAddress(address1Billing.val())){
      errorLine.html("Billing address contains invalid characters");
      address1Billing.focus();
      return;
    }
    if(!isValidAddress(address2Billing.val())){
      errorLine.html("Billing address contains invalid characters");
      address2Billing.focus();
      return;
    }
    if(isEmpty(city.val())){
      errorLine.html("Shipping city is empty");
      city.focus();
      return;
    }
    if(!isValidCity(city.val())){
      errorLine.html("Shipping city contains invalid characters");
      city.focus();
      return;
    }
    if(isEmpty(cityBilling.val())){
      errorLine.html("Billing city is empty");
      cityBilling.focus();
      return;
    }
    if(!isValidCity(cityBilling.val())){
      errorLine.html("Billing city contains invalid characters");
      cityBilling.focus();
      return;
    }
    if(isEmpty(state.val())){
      errorLine.html("Shipping state is empty");
      state.focus();
      return;
    }
    if(!isValidState(state.val())){
      errorLine.html("Shippiing state is not a valid state");
      state.focus();
      return;
    }
    if(isEmpty(stateBilling.val())){
      errorLine.html("Billing state is empty");
      stateBilling.focus();
      return;
    }
    if(!isValidState(stateBilling.val())){
      errorLine.html("Billing state is not a valid state");
      stateBilling.focus();
      return;
    }
    if(isEmpty(zip.val())){
      errorLine.html("Shipping zip is empty");
      zip.focus();
      return;
    }
    if(!isValidZip(zip.val())){
      errorLine.html("Shipping zip is not a valid zip code");
      zip.focus();
      return;
    }
    if(isEmpty(zipBilling.val())){
      errorLine.html("Billing zip is empty");
      zipBilling.focus();
      return;
    }
    if(!isValidZip(zipBilling.val())){
      errorLine.html("Billing zip is not a valid zip code");
      zipBilling.focus();
      return;
    }
    if(isEmpty(ccNumber.val())){
      errorLine.html("Please enter in a credit card number");
      ccNumber.focus();
      return;
    }
    if(!isNumber(ccNumber.val())){
      errorLine.html("Credit card number must contain digits only");
      ccNumber.focus();
      return;
    }
    if(ccNumber.val().length < 12){
      errorLine.html("Credit card number must contain at least 12 digits");
      ccNumber.focus();
      return;
    }
    if(isEmpty(ccExp1.val())){
      errorLine.html("Credit card expiration month is empty");
      ccExp1.focus();
      return;
    }
    if(!isNumber(ccExp1.val())){
      errorLine.html("Credit card expiration month must be a number");
      ccExp1.focus();
      return;
    }
    if(isEmpty(ccExp2.val())){
      errorLine.html("Credit card expiration year is empty");
      ccExp2.focus();
      return;
    }
    if(!isNumber(ccExp2.val())){
      errorLine.html("Credit card expiration year must be a number");
      ccExp2.focus();
      return;
    }

    var SKUs = "";
    var quantities = "";
	var querystring = "";
	
	/*
    for(var i=0; i<cookieArray.length; i++){
	  SKUs = "";
      SKUs += cookieArray[i][0];
      if(i != cookieArray.length-1){
        SKUs += ",";
      }
	  quantities = "";
      quantities += cookieArray[i][1];
      if(i != cookieArray.length-1){
        quantities += ",";
      } 
	}
	  */
    for(var i=0; i<cookieArray.length; i++){
		
		 querystring += cookieArray[i][0];
		 querystring += "|";
		 querystring += cookieArray[i][1];
		 
		 if(i != cookieArray.length-1){
			  querystring += "||";
		 }
	}
	
    $.ajax({
      type: "POST",
      url: "/perl/jadrn050/proj4/db_insert.cgi",
      data: "queryVal="+querystring,
      error: function(response){ alert("Script error, please try again later");},
      success: function(response){
        if(parseInt(response) < 1){
          alert("There was an error submitting information to the database...please try again later");
          $("#dialog-modal").dialog('close');
        }
        else{
          $("#dialog-modal").dialog('close');
          showConfirmationPage();
        }
      }
    });
	
  } // End of submitOrder()


  function showConfirmationPage(){
    var str = "";
    str += "<h1 class=\"success\">Order Confirmation</h1>";

    str += "<div class=\"button1 checkout_information\">";
    str += "<div class=\"button1\">";
    str += "<p><u>Billing Information</u></p><br />";
    str += "<p>"+firstName.val() + " " +lastName.val()+"</p>";
    str += "<p>"+address1.val()+"</p>";
    if(!isEmpty(address2.val())){
      str += "<p>"+address2.val()+"</p>";
    }
    str += "<p>"+city.val()+", "+state.val()+" "+zip.val()+"</p>";
    if(!isEmpty(phone.val())){
      str += "<p>"+phone.val()+"</p>";
    }
    str += "</div>";

    str += "<div class=\"button1 checkout_information1\">";
    str += "<p><u>Shipping Information</u></p><br />";
    str += "<p>"+firstNameBilling.val() + " " +lastNameBilling.val()+"</p>";
    str += "<p>"+address1Billing.val()+"</p>";
    if(!isEmpty(address2Billing.val())){
      str += "<p>"+address2Billing.val()+"</p>";
    }
    str += "<p>"+cityBilling.val()+", "+stateBilling.val()+" "+zipBilling.val()+"</p>";
    if(!isEmpty(phoneBilling.val())){
      str += "<p>"+phoneBilling.val()+"</p><br />";
    }
    str += "</div>";
    str += "<div class=\"clear\"></div>";

    str += "<div>";
    str += "<br /><p>Charged to:</p>";
    if(ccType.val() == "0"){
      str += "<p>Visa #";
    }
    else if(ccType.val() == "1"){
      str += "<p>Mastercard #";
    }
    else if(ccType.val() == "2"){
      str += "<p>Discover #";
    }
    else if(ccType.val() == "3"){
      str += "<p>American Express #";
    }
    for(var i=0; i<(ccNumber.val().length-4); i++){
      str += "X";
    }
    str += ccNumber.val().substr((ccNumber.val().length-4))+" <br />Exp. "+ccExp1.val()+"/"+ccExp2.val()+"</p>";
    str += "</div>";
    str += "</div>"; // Div for all order information

  //  str += "<div class=\"button1 checkout_information3\">";
  //  str += "<img src=\"./images/dancing_chocolates.png\" alt=\"Bertha's Thank You\" width=\"250px\" />";
  //  str += "</div>";

    str += "<div class=\"clear\"></div>";
    str += "<hr />";

    successDiv.html(str);

    getConfirmationContent();
    getConfirmationTotals();

    document.cookie = 'jadrn050=; expires=-1;path=/';
    cartNumber.html(0);
  }


}); // END OF ON DOCUMENT READY



function isDigit(chr) {
	if(chr.match(/[0-9]/)){
		return true;
	}
	return false;
}


function isEmpty(fieldValue) {
	return $.trim(fieldValue).length == 0;
}

function isValidState(state) {
	var upperState = state.toUpperCase();
	var stateList = new Array("AK","AL","AR","AZ","CA","CO","CT","DC",
		"DC2","DE","FL","GA","GU","HI","IA","ID","IL","IN","KS","KY","LA",
		"MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH",
		"NJ","NM","NV","NY","OH","OK","OR","PA","PR","RI","SC","SD","TN",
		"TX","UT","VA","VT","WA","WI","WV","WY");
	for(var i=0; i < stateList.length; i++)
		if(stateList[i] == $.trim(upperState))
			return true;
	return false;
}

function isValidZip(zip) {
	if(zip.length != 5)
		return false;
	for(var i=0; i < zip.length; i++){
		if(!isDigit(zip[i]))
			return false;
	}
	return true;
}

function isNumber(zip) {
	for(var i=0; i < zip.length; i++){
		if(!isDigit(zip[i]))
			return false;
	}
	return true;
}

function isValidName(fieldValue) {
	var name = $.trim(fieldValue);

	for(var i=0; i<name.length;i++){
		var chr = name[i];

		if(chr == "~" || chr == "!" || chr == "@" || chr == "#" ||
			chr == "$" || chr == "%" || chr == "^" || chr == "&" ||
			chr == "*" || chr == "(" || chr == ")" || chr == "_" ||
			chr == "+" || chr == "=" || chr == "{" || chr == "[" ||
			chr == "}" || chr == "]" || chr == "|" || chr == ":" ||
			chr == ";" || chr == "," || chr == ">" || chr == "?" ||
			chr == "/" || chr.charCodeAt(0) == 92 ||
			chr.charCodeAt(0) == 60 || chr.charCodeAt(0) == 9 ||
			chr.charCodeAt(0) == 34 || chr.match(/[0-9]/)){
			return false;
		}
	}
	return true;
}

function isValidAddress(fieldValue) {
	var addr = $.trim(fieldValue);

	for(var i=0; i<addr.length;i++){
		var chr = addr[i];

		if(chr == "~" || chr == "!" || chr == "@" ||
			chr == "$" || chr == "%" || chr == "^" ||
			chr == "*" || chr == "(" || chr == ")" ||
			chr == "+" || chr == "=" || chr == "{" || chr == "[" ||
			chr == "}" || chr == "]" || chr == "|" ||
			chr == ";" || chr == ">" || chr == "?" ||
			chr == "/" || chr.charCodeAt(0) == 92 ||
			chr.charCodeAt(0) == 60 || chr.charCodeAt(0) == 9 ||
			chr.charCodeAt(0) == 34){
			return false;
		}
	}
	return true;
}

function isValidChar(chr) {
	if(chr == "~" || chr == "!" || chr == "@" || chr == "#" ||
		chr == "$" || chr == "%" || chr == "^" ||
		chr == "*" || chr == "(" || chr == ")" || chr == "_" ||
		chr == "+" || chr == "=" || chr == "{" || chr == "[" ||
		chr == "}" || chr == "]" || chr == "|" || chr == ":" ||
		chr == ";" || chr == ">" || chr == "?" ||
		chr == "/" || chr.charCodeAt(0) == 92 ||
		chr.charCodeAt(0) == 60 || chr.charCodeAt(0) == 9 ||
		chr.charCodeAt(0) == 34){
		return false;
	}
	return true;
}

function isValidCity(fieldValue) {
	var city = $.trim(fieldValue);

	for(var i=0; i<city.length;i++){
		var chr = city[i];

		if(!isValidChar(chr))
			return false;
	}
	return true;
}

// from http://www.webmasterworld.com/forum91/3262.htm            
function explodeArray(item,delimiter) {
tempArray=new Array(1);
var Count=0;
var tempString=new String(item);

while (tempString.indexOf(delimiter)>0) {
tempArray[Count]=tempString.substr(0,tempString.indexOf(delimiter));
tempString=tempString.substr(tempString.indexOf(delimiter)+1,tempString.length-tempString.indexOf(delimiter)+1);
Count=Count+1
}

tempArray[Count]=tempString;
return tempArray;
}
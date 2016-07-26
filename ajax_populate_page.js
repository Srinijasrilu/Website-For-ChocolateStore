   



var proj4_data;
var cart = new shopping_cart("jadrn050");

$(document).ready(function() {
    proj4_data = new Array();
	
	var searchbox = $("[name='search']");
	var searchbutton = $("[name='searchicon']");
	searchbutton.click(function(){ doSearch(searchbox.val());});
	var categories = $("[name='categories']");
	
	var quantityDropdown = $("[name='quantity_dropdown']");
	var cancelButton = $("[name='cancel_button']");
	var addToCartButton = $("[name='add_to_cart_button']");
	cancelButton.click(function(){ $("#dialog-modal").dialog('close');});
	var cartIcon = $("[name='cart_icon']");
	var cartNumber = $("[name='cart_number']");
    $.get('/perl/jadrn050/proj4/get_products.cgi', storeData);
	 $( "#dialog-modal" ).dialog({
            height: 250,
            width: 500,
            modal: true,
            autoOpen: false
    });
	$(document).on('click', '.item_title', function(){showProduct(this.id); });
	$(document).on('click', '.item_picture', function(){showProduct(this.name); });
	$(document).on('click', '.item_add_to_cart_picture', function(){openCartDialog(this.name);});
	
	function openCartDialog(sku) { 
		addToCartButton.click(function(){ addItemtoCart(sku);});
		var str = "";
		quantityDropdown.val("1");

		for(var i=0; i<proj4_data.length; i++){
			if(sku == proj4_data[i][0]){
				$("[name='add_to_cart_dialog']").html("Add "+proj4_data[i][2]+" to cart?");
			}
		}

		$("#dialog-modal").dialog('open');
	}
	function addItemtoCart(sku) {
    addToCartButton.off();

    var quantity = quantityDropdown.val();
    cart.add(sku, quantity);

    $("#dialog-modal").dialog('close');
    cartNumber.html(cart.size());
    window.location.href = "order.html";
	}
	
    });    

    
function storeData(response) {
    var tmpArray = explodeArray(response,';');
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        proj4_data[i] = innerArray;
    }
	
// Dyanamically load the home page

 tmpString = "<table class='tabledata'><tr>";
        var ctr = 0;
		var ctg_val = ["Brittles and toffies", "Dark chocolate", "Holiday assortments", "Nuts and chews", "Gifts", "Truffles", "Milk chocolate"];
        for(var j=0; j < ctg_val.length; j++) {
         for(var i=0; i < proj4_data.length; i++) {
          if(proj4_data[i][1] != null && proj4_data[i][1] == ctg_val[j]){
			  
			if(ctr == 3){
			tmpString += "</tr>";
			tmpString += "<tr><td class='homepage1' >";
		   
            ctr = 0;
           } else{
			   tmpString += "<td class='homepage1' >"
		   }
    
           tmpString += proj4_data[i][1]+"<br />";
           tmpString += "<img src=\"/~jadrn000/PROJ4_IMAGES/"+proj4_data[i][0]+".jpg\" alt=\""+proj4_data[i][2]+"\""+" width=\"200px\"  /><br />";
           tmpString += "</td>"
           ctr++;
           break;
          }} }
        tmpString += "</tr></tables>"
        var handle = document.getElementById('home_page_content');
  handle.innerHTML = tmpString;
	
	display_selected("Milk chocolate");
}       

function display_selected(chocolate) {
	
	tmpString = "";
	if(chocolate == ''){
		chocolate = "All"
	}
	for(var i=0; i<proj4_data.length; i++){
		if(proj4_data[i][1] != null && (chocolate == "All" || proj4_data[i][1] == chocolate)){
		tmpString += "<div class=\"item\">";

      // Show the item's picture
			tmpString += "<img src=\"/~jadrn000/PROJ4_IMAGES/"+proj4_data[i][0]+
        ".jpg\" alt=\""+proj4_data[i][2]+"\" width=\"150px\" " +
        "class=\"button1 pointer1 item_picture\" name=\""+proj4_data[i][0]+"\" />";

      // Show the box with the item's name, short description and price
      tmpString += "<div class=\"item_description\">";
      tmpString += "<span class=\"item_title\" id=\""+proj4_data[i][0]+"\">"+proj4_data[i][2] + "</span><br /><span class=\"item_category\">in "+proj4_data[i][1]+"</span>";
      tmpString += "<br /><br />";
      tmpString += proj4_data[i][3];
      tmpString += "<br /><br />";
      tmpString += "$" + proj4_data[i][6];
      tmpString += "</div>"; // item_description div

      // Show the add to cart button
      tmpString += "<div class=\"item_add_to_cart\">";
      tmpString += "<img src=\"./images/addtocart.jpg\" alt=\"add to cart\" width=\"150\" "+
        "name=\""+proj4_data[i][0]+"\" class=\"pointer1 item_add_to_cart_picture\">";
      tmpString += "</div>"; // item_add_to_cart div

			tmpString += "</div>"; // item div

      if(i != proj4_data.length-1){
        tmpString += "<hr />";
		}
		}
	}
	var handle = document.getElementById('placeholder');
    handle.innerHTML = tmpString;
		
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

function doSearch(token){
	
	tmpString = "";

	for(var i=0; i<proj4_data.length; i++){
		if(proj4_data[i][1] != null && proj4_data[i][1].indexOf(token) > -1) {
		tmpString += "<div class=\"item\">";

      // Show the item's picture
			tmpString += "<img src=\"/~jadrn000/PROJ4_IMAGES/"+proj4_data[i][0]+
        ".jpg\" alt=\""+proj4_data[i][2]+"\" width=\"150px\" " +
        "class=\"button1 pointer1 item_picture\" name=\""+proj4_data[i][0]+"\" />";

      // Show the box with the item's name, short description and price
      tmpString += "<div class=\"item_description\">";
      tmpString += "<span class=\"item_title\" id=\""+proj4_data[i][0]+"\">"+proj4_data[i][2] + "</span><br /><span class=\"item_category\">in "+proj4_data[i][1]+"</span>";
      tmpString += "<br /><br />";
      tmpString += proj4_data[i][3];
      tmpString += "<br /><br />";
      tmpString += "$" + proj4_data[i][6];
      tmpString += "</div>"; // item_description div

      // Show the add to cart button
      tmpString += "<div class=\"item_add_to_cart\">";
      tmpString += "<img src=\"./images/addtocart.jpg\" alt=\"add to cart\" width=\"150\" "+
        "name=\""+proj4_data[i][0]+"\" class=\"pointer1 item_add_to_cart_picture\">";
      tmpString += "</div>"; // item_add_to_cart div

			tmpString += "</div>"; // item div

      if(i != proj4_data.length-1){
        tmpString += "<hr />";
		}
		}
	}
	var handle = document.getElementById('placeholder');
    handle.innerHTML = tmpString;
}

// displays an expanded product view of the selected product
function showProduct(sku){
  var str = "";

  for(var i=0; i<proj4_data.length; i++){
    if(sku == proj4_data[i][0]){

      str += "<img src=\"/~jadrn000/PROJ4_IMAGES/"+proj4_data[i][0]+
        ".jpg\" alt=\""+proj4_data[i][2]+"\" width=\"300px\" class=\"button1 product_picture\"/>";

      str += "<div class=\"product_details\">";
      str += proj4_data[i][2] + "<br /><span class=\"item_category\">in "+proj4_data[i][1]+"</span>";
      str += "<br /><br />";
      str += proj4_data[i][3];
      str += "<br /><br />";
      str += "$" + proj4_data[i][6];
      str += "<div class=\"product_add_to_cart\">";
      str += "<img src=\"./images/addtocart.jpg\" alt=\"add to cart\" width=\"150\" "+
        "name=\""+proj4_data[i][0]+"\" class=\"pointer1 item_add_to_cart_picture\">";
      str += "</div>"; // item_add_to_cart div
      str += "</div>"; // product_details div

      str += "<div class=\"clear\"></div>"

      str += "<div class=\"product_description\">";
      str += "<p>Product Description:</p><br />";
      str += "<p>"+proj4_data[i][4]+"</p>";
      str += "</div>"; // product_description div

      str += "<div>&nbsp;</div>";
    }
  }

  	var handle = document.getElementById('placeholder');
    handle.innerHTML = str;
 //  $("#content").html(str);
}

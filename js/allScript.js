

$(document).ready( function(){
  var cart = new shopping_cart("jadrn050");
  var cartNumber = $("[id='cart_number']");
  var cartIcon = $("[id='cart_icon']");
  var logo = $("[id='logo']");

  cartNumber.html(cart.size());

  logo.click(function(){ window.location.href = "index.html";});
  cartIcon.click(function(){ window.location.href = "order.html";});
  cartNumber.click(function(){ window.location.href = "order.html";});

}); // END OF ON DOCUMENT READY
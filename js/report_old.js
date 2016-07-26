var sales_data;
var sales_data_array;
var proj4_datas;
var profit;
$(document).ready( function(){
 sales_data = new Array();
 sales_data_array = new Array();
 proj4_datas = new Array();
 profit=0;
 $.get('/perl/jadrn050/proj4/get_products.cgi', storeDatas);
  
 $.get('/perl/jadrn050/proj4/report.cgi', processData);
 document.cookie = 'jadrn050=; expires=-1;path=/';
}); // END OF ON DOCUMENT READY

function processData(response) {
    var tmpArray = explodeArray(response,';');
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        sales_data[i] = innerArray;
    }
	

 tmpString = "<table class='tabledata'><tr><th>Sku</th><th>Category</th><th>Actual price</th><th>Retail price</th><th>Quantity</th><th>Date of Purchase</th></tr>";       
        var ctg = ["Sku", "Quantity", "date"];
		for(var j=0; j < sales_data.length-1; j++) {
		tmpString +=		"<tr>";
         for(var i=0; i < ctg.length; i++) {
          if(sales_data[i][0] != null && sales_data[i][1] != null && sales_data[i][2] != null){
				tmpString +=		"<td>";	
				tmpString += sales_data[j][i];
				tmpString += "</td>";
			}
			if(proj4_datas != null){
				 for(var k=0; k < proj4_datas.length; k++) {
					  if(sales_data[j][1] != null && proj4_datas[k][0] != null && proj4_datas[k][0] == sales_data[j][i]){
						
						tmpString +=		"<td>";	
						tmpString += proj4_datas[k][1];
						tmpString += "</td>";
						
						tmpString +=		"<td>";	
						tmpString += (proj4_datas[k][5]*sales_data[j][1]).toFixed(2);
						tmpString += "</td>";
				
						tmpString +=		"<td>";	
						tmpString += (proj4_datas[k][6]*sales_data[j][1]).toFixed(2);
						tmpString += "</td>";
						profit += (proj4_datas[k][6]*sales_data[j][1]).toFixed(2) - (proj4_datas[k][5]*sales_data[j][1]).toFixed(2); 
						
						 break;						 
					  }
				 }
			}
		} 
		}
		////////
	/*	
		var cost = parseFloat(sold_product_info[i][5]).toFixed(2);
    var salePrice = parseFloat(sold_product_info[i][6]).toFixed(2);
    var profit = (salePrice - cost).toFixed(2);
    
    totalQuantitySold = totalQuantitySold + quantity;
    totalSales = totalSales + salePrice * quantity;
    totalCost = totalCost + cost * quantity;
    totalProfit = totalProfit + (parseFloat(profit))*quantity;
    
    tableString += "<tr>"+
      "<td>" + sku + "</td>" +
      "<td>" + imgString + "</td>" +
      "<td>" + name + "</td>" +
      "<td>" + quantity + "</td>" +
      "<td>" + cost + "</td>" +
      "<td>" + salePrice + "</td>" +
      "<td>" + profit + "</td>" +
      "</tr>";
  }
  console.log(totalProfit);
  tableString += "<tr class=\"info\"><td><strong>Total Number of Items Sold</strong></td><td colspan=\"6\"><strong>"+totalQuantitySold+"</strong></td></tr>";
  tableString += "<tr class=\"info\"><td><strong>Total Sales</strong></td><td colspan=\"6\"><strong>"+totalSales.toFixed(2)+"</strong></td></tr>";
  tableString += "<tr class=\"info\"><td><strong>Total Cost</strong></td><td colspan=\"6\"><strong>"+totalCost.toFixed(2)+"</strong></td></tr>";
  tableString += "<tfoot><tr class=\"info\"><td><strong>Total Profit</strong></td><td colspan=\"6\"><strong>"+totalProfit.toFixed(2)+"</strong></td></tr>"+
		
	
		
		////////
		/*
		tmpString +=		"</tr>";
		}
        tmpString += "</tables><br/>";
		
		 tmpString += "<th>Profit</th><th>";
		tmpString += profit;
		tmpString +="</th>";
        var handle = document.getElementById('placeholder1');
		handle.innerHTML = tmpString;
	
		
} 

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

function storeDatas(response) {
    var tmpArray = explodeArray(response,';');
    for(var i=0; i < tmpArray.length; i++) {
        innerArray = explodeArray(tmpArray[i],'|');
        proj4_datas[i] = innerArray;
    }
}
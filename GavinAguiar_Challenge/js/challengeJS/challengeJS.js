



var APIKeySet;

var currAPIKeyStr = "";
var currAPIKeyIndex = -1;
var productsToCheck;

var searchURL = "http://api.zappos.com/Search?term=boots&key=" + currAPIKeyStr;

function init__(){
	currAPIKeyIndex = -1;
	
	console.log("DOM Loaded. Init Called.");
	console.log("Initing possible API Keys.");
	
	// add working keys here.
	APIKeySet = new Array("b05dcd698e5ca2eab4a0cd1eee4117e7db2a10c4", "12c3302e49b9b40ab8a222d7cf79a69ad11ffd78", "5b8384087156eb88dce1a1d321c945564f4d858e", "a73121520492f88dc3d33daf2103d7574f1a3166");
	
	console.log("Initing API Key");
	currAPIKeyStr = getNewAPIKey();
	
	console.log("Key: " + currAPIKeyStr);
	
}

function getNewAPIKey(){
	console.log("Getting new API Key ... ");
	currAPIKeyIndex++;
	if(currAPIKeyIndex >= APIKeySet.length){
		console.log("All Keys Exhausted");
		return "-1";
	}
	
	console.log(currAPIKeyIndex);
	
	return APIKeySet[currAPIKeyIndex];
}

function searchProduct(term, callbackOnResult, callbackOnFailure){
	
	$("<br />Fetching items ... ").appendTo("#pOut");
	
	if(currAPIKeyStr === "-9")
	{
		console.log("All API Keys exhausted");
		return;
	}
	
	var searchURL = "http://api.zappos.com/Search?term=" + term + "&limit=100&key=" + currAPIKeyStr;
	
	
	var r = $.ajax({ 
		type: "GET",   
        url: searchURL,   
        async: true,
        dataType: "jsonp",
        success : function(responseObj)
        {
            callbackOnResult(responseObj);
        },
        error : function(error) {
            console.log(error);
        }
		
	});
	
	checkStatus(0, r); //JSONP & JQuery issue ... work around 
	function checkStatus(c, r)
	{
		console.log("Checking status ... ");
		console.log(r.state());
		if(r.state() === "resolved")
			return;
		
		if(c > 2)
		{
			console.log("Aborting request");
			r.abort();
			
			currAPIKeyStr = getNewAPIKey();
			searchProduct(term, callbackOnResult, callbackOnFailure);
			return;
		}
		
		setTimeout(function(){checkStatus(++c, r);}, 1000);
	}
	
}



function placeWait(tagid){
	$(tagid).html("Please Wait ... <div style='display:inline-block;width:100%;height:100%;text-align:center;vertical-align:middle;' valign='middle'><img style='vertical-align: middle' src='img/wait.gif' /></div>");
}

function printProductHTMLCode(obj){
	
	var html = "";
	
		html += obj.brandName + " ";
		html += obj.productName + " ";
		html += obj.price + " ";
		html += "<img src='"+obj.thumbnailImageUrl+"' /><br />";

	return html;
}

function constrainedSearch(){
	console.log("Performing Search ... ");
	placeWait("#pOut");
	
	searchProduct("boots", function(response){iterateProducts(response);}, null);
}

var finalPG = "";

function iterateProducts(productListObj){
	
	$("#pOut").html(""); 
	
	var n = parseFloat($("#pCount").val(), 10);
	var budget = parseFloat($("#pBudget").val(), 10);
	var productObjArr = new Array();
	var productCostsArr = new Array();
	
	$.each( productListObj.results, function( key, prodObj ) {
		  productObjArr.push(prodObj);
	  });
	
	for(var i = 0; i < productObjArr.length; i++){
		
		productCostsArr[i] = parseFloat(productObjArr[i].price.replace("$",""), 10);
	}
	
	finalPG = "";
	
	getProducts(productObjArr, productCostsArr, n, 0, budget, 0, 0, " ");
	if(finalPG === "")
	{
		$("#pOut").append("NO ITEMS FOUND THAT MATCH THE CRITERIA ... ");
	}
	else
	{
		$("#pCount").append("ITEMS FOUND THAT MATCH THE CRITERIA ... " +count);
		$("#pOut").append(finalPG);
	}
}


var count = 0;
function getProducts(productObjArr, productCostsArr, noOfProductsToBuy, productsChosen, targetBudget, sumSoFar, currentProduct, productGroups)
{
    if (noOfProductsToBuy >= productCostsArr.length)
    	{
    		return; // if required products are more than the number of products then return
    		
    	}

    if (currentProduct >= productCostsArr.length)
    {
    	if (productsChosen == noOfProductsToBuy && targetBudget == sumSoFar)
    	{
    		finalPG += productGroups + "<hr />";
			console.log(productGroups);
			count++;
    	}
        return;
    }

    if (productsChosen == noOfProductsToBuy)
    {
        if (targetBudget == sumSoFar)
    	{
        	finalPG += productGroups + "<hr />";        	
        	console.log(productGroups);
			count ++;
    	}           
        return;
    }
    
    getProducts(productObjArr, productCostsArr, noOfProductsToBuy, productsChosen, targetBudget, sumSoFar, currentProduct + 1, productGroups);
    getProducts(productObjArr, productCostsArr, noOfProductsToBuy, productsChosen + 1, targetBudget, sumSoFar + productCostsArr[currentProduct], currentProduct + 1, productGroups + " " + printProductHTMLCode(productObjArr[currentProduct]));
}

function getProductInfo(productId){
	
}

function getProductImage(productId){

}

function getAutoCompleteOptions(term){
	
}



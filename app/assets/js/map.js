var myMap;

function init(){ 
	myInt = setInterval(function(){
		if($('#map-container').length){
			myMap = new ymaps.Map("map-container", {
       			center: [53.901090 , 27.558759],
        		zoom: 11
    		});
    		clearInterval(myInt);
		}
	},500);    
    
}

ymaps.ready(init);
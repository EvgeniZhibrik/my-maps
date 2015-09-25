var myMap;
var mapCenter = [53.901090 , 27.558759];
var mapZoom = 18;

function initMap(){ 
	var myInt = setInterval(function(){
		if($('#map-container').length){
			myMap = new ymaps.Map("map-container", {
       			center: mapCenter,
        		zoom: mapZoom
    		});
            myMap.geoObjects.add(loadingObjectManager);
    		clearInterval(myInt);
            
		}
	},500);    
    
    var loadingObjectManager = new ymaps.LoadingObjectManager('http://localhost:8000/api/v1.0/cafe/?bbox=%b&z=%z',
    {   
        // Включаем кластеризацию.
        clusterize: true,
        splitRequests: true,
        // Опции кластеров задаются с префиксом cluster.
        clusterHasBalloon: true,
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Опции объектов задаются с префиксом geoObject
        geoObjectOpenBalloonOnClick: true,
        geoObjectHasBalloon: true
        //geoObjectBalloonContentLayout: MyBalloonContentLayoutClass,
    });

}

function closeMap(){
    if(myMap){
        mapCenter = myMap.getCenter();
        mapZoom = myMap.getZoom();
        myMap.destroy();
    }
}



ymaps.ready(initMap);
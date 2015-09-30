var classMap = (function(){
    var instance;
    function init(){
        var myMap;
        var mapCenter = [53.901090 , 27.558759];
        var mapZoom = 18;
        return {
            reloadMap: function (){
                if(myMap){
                    mapCenter = myMap.getCenter();
                    mapZoom = myMap.getZoom();
                    myMap.destroy();
                    myMap = null;
                }
                this.initMap();   
            },
            initMap: function (){
                if($('#map-container').length){
                    myMap = new ymaps.Map("map-container", {
                        center: mapCenter,
                        zoom: mapZoom
                    });
                    var checkbox = $('#subscribed-checkbox').prop('checked');
                    var userID = appState.getInstance().getUser()._id;
                    var loadingObjectManager = new ymaps.LoadingObjectManager('http://localhost:8000/api/v1.0/cafe/?bbox=%b&z=%z&subscribed='+checkbox+'&id='+userID,
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
                    myMap.geoObjects.add(loadingObjectManager);

                }    
            
                
            }
        };
    };
    return {
        check: function(){
            return !!instance;
        },
        getInstance: function(){
            if(!instance){
                instance=init();
            }
            return instance;
        }
    };
})();

ymaps.ready(function(){
    var x = classMap.getInstance();
});
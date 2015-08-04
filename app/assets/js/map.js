var myMap;

function init(){ 
	myInt = setInterval(function(){
		if($('#map-container').length){
			myMap = new ymaps.Map("map-container", {
       			center: [53.901090 , 27.558759],
        		zoom: 18
    		});
            myMap.geoObjects.add(loadingObjectManager);
    		clearInterval(myInt);
            
		}
	},500);    
    var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
    	'<h3>{{ properties.cafe.name }}</h3>' +
    	'<p>Описание: {{ properties.cafe.description }}</p>' +
    	'<p>Сайт: {{ properties.cafe.website|default:"неизвестно" }}</p>' +
    	'<p>Фотографии: {% if properties.fotos.length %}{{properties.photoTag}}{% else %}нет{% endif %}</p>' +
    	'<p>Отзывы: {% if properties.comments.length %}{{properties.commentsTag}}{% else %}нет{% endif %}</p>'
	);

    var loadingObjectManager = new ymaps.LoadingObjectManager('http://localhost:8000/api/v1.0/cafe/?bbox=%b&z=%z',
      {   
        // Включаем кластеризацию.
        clusterize: true,
        splitRequests: true,
        // Опции кластеров задаются с префиксом cluster.
        clusterHasBalloon: true,
        clusterDisableClickZoom: true,
        clusterOpenBaloonOnClick: true,
        // Опции объектов задаются с префиксом geoObject
        geoObjectOpenBalloonOnClick: true,
        geoObjectBaloonContentLayout: MyBalloonContentLayoutClass
      });

}





ymaps.ready(init);
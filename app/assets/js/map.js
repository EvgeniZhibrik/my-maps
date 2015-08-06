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
    /*var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
    	'<h3>{{ properties.cafe.name }}</h3>' +
    	'<p>Описание: {{ properties.cafe.description }}</p>' +
    	'<p>Сайт: {{ properties.cafe.website|default:"неизвестно" }}</p>' +
    	'<div class = "fototag">Фотографии: {% for value in properties.photos %}<img src={{value}} />{% endfor %}</div> ' +

    	'<p>Отзывы: {% if properties.comments.length %}{{properties.commentsTag}}{% else %}нет{% endif %}</p>'
	);*/

    var safeFilter = function (data, tagString, filterValue) {
        var s = tagString.slice(4,tagString.length-4);
        return s;
    }

    ymaps.template.filtersStorage.add('safe', safeFilter);
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
    /*var onClickFunction = function (e){
        console.log(e);
        var obj = e.get('target');
        console.log(obj.properties);

        //obj.baloon.open();
    };
    loadingObjectManager.objects.events.add(['click'], onClickFunction);*/
}





ymaps.ready(init);
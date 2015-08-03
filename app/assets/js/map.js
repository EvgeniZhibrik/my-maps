var myMap;

function init(){ 
	myInt = setInterval(function(){
		if($('#map-container').length){
			myMap = new ymaps.Map("map-container", {
       			center: [53.901090 , 27.558759],
        		zoom: 11
    		});
    		clearInterval(myInt);
            getCafe(function(json){
                console.log(json);
            });
		}
	},500);    
    var MyBalloonContentLayoutClass = ymaps.templateLayoutFactory.createClass(
    	'<h3>{{ properties.cafe.name }}</h3>' +
    	'<p>Описание: {{ properties.cafe.description }}</p>' +
    	'<p>Сайт: {{ properties.cafe.website|default:"неизвестно" }}</p>' +
    	'<p>Фотографии: {% if properties.fotos.length %}{{properties.photoTag}}{% else %}нет{% endif %}</p>' +
    	'<p>Отзывы: {% if properties.comments.length %}{{properties.commentsTag}}{% else %}нет{% endif %}</p>'
	);

}





ymaps.ready(init);
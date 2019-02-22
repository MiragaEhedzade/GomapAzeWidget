 
    var map;
    
    function init() {
        map = new OpenLayers.Map({
            div: "map",
            projection: new OpenLayers.Projection("EPSG:900913"),
            units: "m",
            restrictedExtent: new OpenLayers.Bounds(4400000, 4600000, 5700000, 5500000)
        });
        map.displayProjection = new OpenLayers.Projection("EPSG:4326");

        var gomapLayer = new OpenLayers.Layer.OSM("GoMap.Az", "http://maps.gomap.az/info/xyz.do?lng=az&x=${x}&y=${y}&z=${z}&f=jpg", { 
			'buffer': 0, attribution: "(c) <a href='http://gomap.az/'>GoMap.Az</a>",tileOptions: { crossOriginKeyword: null },
			transitionEffect: 'resize',
			zoomOffset: 7, 
			numZoomLevels: 12, 
			maxResolution: 1222.99245234375 
		});
		
		var googlemapLayer = new OpenLayers.Layer.Google("Google Satellite",{type: google.maps.MapTypeId.SATELLITE, MIN_ZOOM_LEVEL: 7, MAX_ZOOM_LEVEL: 18});
	
        map.addLayers([gomapLayer, googlemapLayer]);
        map.addControl(new OpenLayers.Control.LayerSwitcher());

        map.setCenter(new OpenLayers.LonLat(defaultLng,defaultLat), 5);
		
		markers = new OpenLayers.Layer.Markers( "Markers" );
		markers.id = "Markers";
		map.addLayer(markers);
		var size = new OpenLayers.Size(21,25);
		var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		var icon = new OpenLayers.Icon('http://m.gomap.az/info/mobile/img/map_mobile/map-marker-icon.png', size, offset);
		markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(defaultLng,defaultLat),icon));

		if(multimarkers)
        {
            function loadMarkers()
            {
                console.log(multicoordinates);
                
                $.each(multicoordinates, function () {
                   markers = new OpenLayers.Layer.Markers( "Markers" );
                   markers.id = "Markers";
                   map.addLayer(markers);
                   var size = new OpenLayers.Size(21,25);
            	   var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
            	   var icon = new OpenLayers.Icon('http://m.gomap.az/info/mobile/img/map_mobile/map-marker-icon.png', size, offset);
                   markers.addMarker(new OpenLayers.Marker(new OpenLayers.LonLat(this.lng,this.lat),icon));
                });
            }
            
            
            /*var lineLayer = new OpenLayers.Layer.Vector("Line Layer"); 

            map.addLayer(lineLayer);                    
            map.addControl(new OpenLayers.Control.DrawFeature(lineLayer, OpenLayers.Handler.Path));                                     
            var points = new Array(
               new OpenLayers.Geometry.Point('5539338.6683015', '4924111.9802944'),
               new OpenLayers.Geometry.Point('5544114.873558', '4921705.6065225')
            );
            
            var line = new OpenLayers.Geometry.LineString(points);
            
            var style = { 
              strokeColor: '#0000ff', 
              strokeOpacity: 0.6,
              strokeWidth: 3
            };
            
            var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
            lineLayer.addFeatures([lineFeature]);*/
            
            
            
            loadMarkers();
        }
        
        
       
		if(clickable)
        {
    		map.events.register("click", map, function(e) {
    		   
    		   map.layers[2].removeMarker(map.layers[2].markers[0]);
    		   var position = map.getLonLatFromPixel(e.xy);
    		   var size = new OpenLayers.Size(21,25);
    		   var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
    		   var icon = new OpenLayers.Icon('http://m.gomap.az/info/mobile/img/map_mobile/map-marker-icon.png', size, offset);   
    		   var markerslayer = map.getLayer('Markers');
    
    		   markerslayer.addMarker(new OpenLayers.Marker(position,icon));
    		   $("#"+latInput).val(position.lat);
    		   $("#"+lngInput).val(position.lon);
    	   });
        }
        
        
        
        /*For search*/
        
		document.querySelector('button.search').addEventListener('click', function(e) {
		  geocodeSearch(document.querySelector('#search').value);
           e.preventDefault();
           return false;
		});

		
		function geocodeSearch(searchStr) {
		  //var bbox = ol.proj.transform($.OLMAP.view.calculateExtent($.OLMAP.map.getSize()),
		  //                             'EPSG:3857', 'EPSG:4326').toString(),
			var bbox = map.getExtent().toBBOX();
			var center = map.getCenter().transform(
							map.getProjectionObject(), //4326
							new OpenLayers.Projection("EPSG:4326")
						);
			var distance = map.getExtent().transform(
						   map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326")
						).getWidth();
			var url = 'http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates' +
			  '?SingleLine=' + searchStr +
			  '&f=json' +
			  '&location=' + center +
			  '&distance=' + distance + // '3218.69' = 2 meters
			  //'&outSR=102100'+ // web mercator
			  //'&searchExtent='+bbox+
			  //'&outFields=Loc_name'+
			  '&maxLocations=1';
		  var parser = new OpenLayers.Format.GeoJSON();
		  var req = window.superagent;
		  req.get(url, function(response){
			var responseJson = JSON.parse(response.text);
			var searchExt = responseJson.candidates[0].extent;
			
            var xminFinded = new OpenLayers.LonLat(lonMin = searchExt.xmin , latMin = searchExt.ymin).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
            // var yminFinded = new OpenLayers.LonLat(searchExt.ymin).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
            var xmaxFinded = new OpenLayers.LonLat(lonMax = searchExt.xmax , latMax = searchExt.ymax).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
            // var ymaxFinded = new OpenLayers.LonLat(searchExt.ymax).transform(new OpenLayers.Projection("EPSG:4326"),new OpenLayers.Projection("EPSG:900913"));
            var extent = new OpenLayers.Bounds(xminFinded.lon, xminFinded.lat , xmaxFinded.lon , xmaxFinded.lat);
			
            
            map.zoomToExtent(extent); 
		  });
		}
        document.map = map;
        /*End*/
		
    }
    setTimeout(init,3000)
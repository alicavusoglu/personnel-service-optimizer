var map;
var markers = [];
var directionsDisplay;
var directionsService;

var start, end;
var wayPoint = [];
var busStops = [];
var busStopCoordinates = [
    { lat: 39.74191139566097, lng: 30.624421618349743 },
    { lat: 39.74613513636375, lng: 30.62995769775648 },
    { lat: 39.74017067718613, lng: 30.629828951723766 },
    { lat: 39.74517133964257, lng: 30.63635785580186 },
    { lat: 39.73822845167247, lng: 30.636046719556134 },
    { lat: 39.743261895792635, lng: 30.64219945904256 },
    { lat: 39.73634839702216, lng: 30.642113628354082 },
    { lat: 39.741246974494686, lng: 30.648205015059375 }];
var myLocation = null;



function infowindow(number) {
    return new google.maps.InfoWindow({ content: number + '. Durak' });
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 39.744037, lng: 30.639328 },
        zoom: 15
    });

    for (var i = 0; i < busStopCoordinates.length; i++) {
        var bs = new google.maps.Marker({ position: new google.maps.LatLng(busStopCoordinates[i].lat, busStopCoordinates[i].lng), icon: '../static/app/images/busstop.png', title: (i + 1).toString(), map: map });
        bs.addListener('click', function () { infowindow((i + 1).toString()).open(map, bs); });
        busStops.push(bs);
    }

    map.addListener('click', function (event) {
        if ($("#comboMyLocType").val() == "O")
            return;
        var marker = new google.maps.Marker({
            position: event.latLng,
            map: map
        });
        markers.push(marker);
    });

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('directionsPanel'));
}
var responses = [];
function calcRoute() {
	debugger;
    if (markers.length == 0) {
        //var pan = document.getElementById('directionsPanel');
        //if ((' ' + pan.className + ' ').indexOf(' disabled ') == -1) {
        //    pan.className += " disabled";
        //    document.getElementById("ham").src = 'images/grey-hamburger.png';
        //}

        directionsDisplay.setMap(null); //in case the map was previously drawn
        for (var i = 0; i < markers.length; i++)
            if (typeof markers[i] != 'undefined')
                markers[i].setMap(map); //redraw the points that were previously turned off
        return; //don't calculate route if all needed points aren't set
    }

    directionsDisplay.setMap(map);
    var actualWaypoints = [];
    for (var i = 0; i < wayPoint.length; i++) { //loop through the waypoints (skip start and end places)
        actualWaypoints[i] = { //subtract 2 to fill this array starting at [0]
            location: wayPoint[i].geometry.location, //latlng object
            stopover: true
        }
    }

    var i = 8;


    for (ids = 0; ids < busStopCoordinates.length; ids++) {
        var request = { //https://developers.google.com/maps/documentation/javascript/directions
            origin: new google.maps.LatLng(markers[0].position.lat(), markers[0].position.lng()),
            destination: new google.maps.LatLng(getPoint(ids).position.lat(), getPoint(ids).position.lng()),
            optimizeWaypoints: true,
            travelMode: google.maps.TravelMode.WALKING
        }

        directionsService.route(request, function (result, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                responses[8 - i] = result;
                i--;
                if (i == 0)
                    showDirection();
            }
        });
    }

    //var pan = document.getElementById('directionsPanel');
    //if ((' ' + pan.className + ' ').indexOf(' disabled ') != -1) {
    //    pan.className = ""; //make panel visible
    //    document.getElementById("ham").src = 'images/hamburger.png';
    //}
}

function getPoint(index) {
    return busStops[index];
}

function showDirection() {
    clearMarkers();

    var bestway;
    var bestdistance = -1;

    for (i = 0; i < responses.length; i++) {
        var distance = 0;
        for (j = 0; j < responses[i].routes[0].legs.length; j++) {
            distance += responses[i].routes[0].legs[j].distance.value;
        }

        if (bestdistance == -1 || distance < bestdistance) {
            bestdistance = distance;
            bestway = responses[i];
        }
    }

    directionsDisplay.setDirections(bestway);
}

function setMarker(n, plc) { //sets markers[n] to the latlng object loc, creates a new marker if it doesn't exist    
    if (n == 0)
        var link = "http://www.googlemapsmarkers.com/v1/00FF00";
    if (n == 1)
        var link = "http://www.googlemapsmarkers.com/v1/FF0000";
    if (n > 1)
        var link = "http://www.googlemapsmarkers.com/v1/FFA500";

    if (typeof markers[n] == 'undefined') { //if it doesn't exist
        markers[n] = new google.maps.Marker({ //create new marker
            position: plc.geometry.location, //a latlng object
            map: map,
            //            label: n.toString(),
            animation: google.maps.Animation.DROP,
            icon: link,
            title: n.toString(),
            draggable: false //make true later if the loc is retrieved from the marker
        });
    }
    else {
        markers[n].setPosition(plc.geometry.location);
    }
}

function clearMarkers() {
    for (var i = 0; i < markers.length; i++)
        if (typeof markers[i] != 'undefined')
            markers[i].setMap(null); //turn markers off but don't delete in case directionsDisplay is turned off
    console.log("***markers cleared");
}

function deletePoint(elem) { //tinyurl.com/gmproj8
    elem = elem.parentNode; //a ul element with id="pointn" where n is sum number. elem started as the <a> element that was clicked
    var i = parseInt(elem.id.substring(5));

    wayPoint.splice(i, 1); //location i, remove 1 element
    markers[i + 2].setMap(null);
    markers.splice(i + 2, 1); //i is offset by 2 bc start and end are in front

    elem.parentNode.removeChild(document.getElementById("point" + i)); //delete element

    for (var t = i + 1; document.getElementById("point" + t) != null; t++) { //fix ids of the others
        document.getElementById("point" + t).id = "point" + (t - 1);
    }

    //    console.log("***removed waypoint[" + i + "]");
    //    console.log("wayPoint=" + wayPoint);
    calcRoute();
}

function printLocations() {
    console.log("Printing geometry.location of all locations");
    if (typeof start != 'undefined')
        console.log("start=" + start.geometry.location);
    else
        console.log("start=UNDEFINED");
    if (typeof end != 'undefined')
        console.log("end=" + end.geometry.location);
    else
        console.log("end=UNDEFINED");

    console.log("wayPoint.length=" + wayPoint.length);
    for (var i = 0; i < wayPoint.length; i++)
        console.log("wayPoint[" + i + "].geometry.location=" + wayPoint[i].geometry.location);
}

function exists(plc, isEndpoint) { //place, boolean indicator if this place will be the start or stop
    for (var i = 0; i < wayPoint.length; i++) { //loop through waypoints
        if (wayPoint[i]['formatted_address'] == plc['formatted_address']) {
            alert("Address:\n" + "'" + wayPoint[i]['formatted_address'] + "'\nis already a waypoint!\n");
            return true;
        }
    }

    //check that the potential waypoint isn't the same as the start or end
    if (!isEndpoint && ((typeof start != 'undefined' && start['formatted_address'] == plc['formatted_address']) || (typeof end != 'undefined' && end['formatted_address'] == plc['formatted_address']))) {
        alert("Address:\n" + "'" + plc['formatted_address'] + "'\nis your start or end point!\n");
        return true;
    }
    return false; //working :D!

}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
        return true;
    } else {
        alert("Geolocation is not supported by this browser.");
        return false;
    }
}

position = null;
function showPosition(position) {
    debugger;
    myLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };


}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}


$("#btnWait").on("click", function () {
    debugger;
    var marker = new google.maps.Marker({
        position: myLocation,
        map: map
    });
    markers.push(marker);

    calcRoute();
});

$("#comboMyLocType").on("change", function () {
    markers = [];
    if ($("#comboMyLocType").val() == "O") {
        getLocation();
    }
    else {
        alert("Harita üzerinde bulunduğunuz yeri seçin");
    }
});


$("#comboMyLocType").change();
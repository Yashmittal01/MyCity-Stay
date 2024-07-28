mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: mapData.geography.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 10 // starting zoom
});

const marker = new mapboxgl.Marker({color: "red"})
.setLngLat(mapData.geography.coordinates)
.setPopup(new mapboxgl.Popup({offset: 25})
.setHTML(`<h4>${mapData.title}</h4><p>Exact location will be provided after booking</p>`))
.addTo(map);


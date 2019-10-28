let latitude, longitude;
let map, marker;
let iTaiwanLocation = [];
let getViewItaiwanLocation = [];
let markers = [];

window.map = map;



$.ajax({
  url: '/data/export.json',
  method: 'get',
  dataType: 'json',
  data: {}
}).done(function (res) {
  $.each(res, function (i, item) {
    iTaiwanLocation.push({lat: Number(item.LATITUDE), lng: Number(item.LONGITUDE)})
  })

  filterMarkers();

}).fail(function (err) {
  console.log(err);
})

function initAutocomplete() {
  let getlocation = {
        lat: 25.042462,
        lng: 121.532294
      };

  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 25.0467427, lng: 121.5139081},
    zoom: 17,
    mapTypeId: 'roadmap'
  });

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocation);
  }

  map.addListener('bounds_changed', _.debounce(filterMarkers, 400));

  $('.btn-location').on('click', function () {
    let $this = $(this);
    if($this.data('open') == true) {
      setMapOnAll(null);
      $this.data('open', false).html('顯示');
    } else {
      setMapOnAll(map);
      $this.data('open', true).html('隱藏');
    }
  })
}


function displayLocation(position) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;

  map.setCenter({lat: latitude, lng: longitude});
}


function filterMarkers () {
  if(iTaiwanLocation) {
    getViewItaiwanLocation.length = 0;
    $.each(iTaiwanLocation, function (i, item) {
      let getNorthEast = map.getBounds().getNorthEast(),
          getSouthWest = map.getBounds().getSouthWest();
      if(item.lat > getSouthWest.lat() && item.lat < getNorthEast.lat() && item.lng > getSouthWest.lng() && item.lng < getNorthEast.lng()) {

        getViewItaiwanLocation.push(item);

      }
    })
    markIcon();
  }
}

function markIcon() {
  if(getViewItaiwanLocation.length > 0) {
    if(markers.length > 0) {
      setMapOnAll(null);
      markers = [];
    }
    $.each(getViewItaiwanLocation, function (i, item) {
      let mark = new google.maps.Marker({
        position: item,
        map: map
      });
      markers.push(mark);
    })
  }
}

function setMapOnAll(map) {
  for(var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}
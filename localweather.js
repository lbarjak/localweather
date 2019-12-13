$(function() {
/*
  if (document.location.protocol == "http:") {
    $("#location").html(
      '<a href="https://codepen.io/lbarjak/full/Kgbmmw/" target="_blank"><font color="red">Please use https://</font></a>'
    );
  }
*/

  var latitude = 47.476404, longitude = 19.055738;
  var skycons = new Skycons({
    monochrome: false,
    colors: {
      main: "#333333",
      moon: "#ffffb3",
      fog: "#78586F",
      fogbank: "#B4ADA3",
      cloud: "gainsboro",
      snow: "#7B9EA8",
      leaf: "#7B9EA8",
      rain: "lightblue",
      sun: "yellow"
    }
  });

  getWeather();

  setInterval(function() {
    getWeather();
  }, 900000); // every 15 minutes

  function getWeather() {

    navigator.geolocation.getCurrentPosition(success, error, options);
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };
    function error(err) {
      $("#title").html(
        'Please Allow "Know your location"<br />in your browser!'
      );
      //console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    function success(result) {
    latitude = result.coords.latitude;
    longitude = result.coords.longitude;
      $("#coords").html("latitude: " + latitude.toFixed(2) + ", longitude: " + longitude.toFixed(2));
      location();
      weather();
    }

    function location() {
      var apiKey = "&key=929ff7ade8cc41e99b688b0ba3740134";
      $.getJSON(
        "https://api.opencagedata.com/geocode/v1/json?q=" + latitude + "+" + longitude + apiKey,
        function(data) {
          var components = data.results[0].components;
          var city = components.city;
          var postcode = components.postcode;
          var city_district = components.city_district;
          var suburb = components.suburb;
          var road = components.road;
          $("#location").html(postcode + " " + city + ", " + suburb);
        }
      );
    }

    function weather() {
      var darksky_api = "https://api.darksky.net/forecast/4e6cca0fe2052f9f2b8c230f148635a8/";
      $.getJSON(
        darksky_api + latitude + "," + longitude + "/?callback=?",
        function(weath) {
          var currently = weath.currently;
          $("#weath").html(currently.summary);
          $("#temperature").html(
            Math.round((currently.temperature - 32) * 5 / 9) + " °C"
          );
          $("#C").on("click", function() {
            $("#temperature").html(
              Math.round((currently.temperature - 32) * 5 / 9) + " °C"
            );
          });
          $("#F").on("click", function() {
            $("#temperature").html(Math.round(currently.temperature) + " F");
          });
          $("#pressure").html(
            "Pressure: " + Math.round(currently.pressure) + " hPa"
          );
          $("#humidity").html(
            "Humidity: " + Math.round(currently.humidity * 100) + "%"
          );
          skycons.add("icon", currently.icon);
          skycons.play();
        }
      );
    }
  }
});

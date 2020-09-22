import moment from "moment-timezone/moment-timezone";
import momentTimezoneWithData10YearRange from "./moment-timezone-with-data-10-year-range";

document.addEventListener("DOMContentLoaded", function () {
  var timeZones = {
    mapProp: null,
    map: null,
    x: document.getElementById("demo"),

    addMarker(lat, lng) {
      console.log("adding marker... at ", lat, lng);

      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: this.map,
      });

      // to remove a marker:
      // marker.setMap(null);
      // we gotta save these markers to an array on a larger scope
      // to retain that pointer so we can do that later tho
    },

    addListItem(lat, lng, tz) {
      console.log("adding list item to HTML");

      var listItem = document.createElement("li");
      listItem.innerHTML = `<div style="display: flex;">
        <p>${lat}, ${lng}</p>
        <b>${tz}</b>
      </div>`;

      console.log(document.getElementById("locations"));

      document.getElementById("locations").appendChild(listItem);
    },

    addLocation(lat, lng, tz) {
      this.addMarker(lat, lng);
      this.addListItem(lat, lng, tz);
    },

    handleClick(event) {
      console.log("handleClick...");

      var plugin = this;

      var lat = event.latLng.lat();
      var lng = event.latLng.lng();

      fetch(
        `https://api.teleport.org/api/locations/${lat},${lng}/?embed=location:nearest-cities/location:nearest-city/city:timezone/tz:offsets-now%20|%20jq%20%27._embedded.%22location:nearest-cities%22[0]._embedded.%22location:nearest-city%22._embedded.%22city:timezone%22%27`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          var tz =
            data._embedded["location:nearest-cities"][0]._embedded[
              "location:nearest-city"
            ]._embedded["city:timezone"].iana_name;
          console.log(tz);

          console.log(plugin);
          // console.log("addLocation... this: ", this);
          plugin.addLocation(lat, lng, tz);
        });
    },

    showPosition(position) {
      console.log("showPosition: this is ", this);
      this.x.innerHTML =
        "Latitude: " +
        position.coords.latitude +
        "<br>Longitude: " +
        position.coords.longitude;

      console.log(this.map);
      this.map.setCenter(
        new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )
      );
    },

    getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    },

    myMap() {
      this.mapProp = {
        center: new google.maps.LatLng(51.508742, -0.12085),
        zoom: 7,
      };
      this.map = new google.maps.Map(
        document.getElementById("googleMap"),
        this.mapProp
      );
      this.getLocation();

      google.maps.event.addListener(
        this.map,
        "click",
        this.handleClick.bind(this)
      );
      google.maps.event.addListener(
        this.map,
        "touchstart",
        this.handleClick.bind(this)
      );
    },

    init() {
      this.myMap(); // this calls getLocation... should it?

      this.d = new Date();
      this.n = this.d.getTime();

      var timezone = "America/Toronto";
      var newLocationTime = moment(this.n).tz(timezone).format(); //format: "ha z"
      console.log("newLocationTime:");
      console.log(newLocationTime);
    },
  };

  timeZones.init();
});

// to-do:
// use descriptive variable names
// clean up

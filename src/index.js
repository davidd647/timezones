import moment from "moment-timezone/moment-timezone";
import momentTimezoneWithData10YearRange from "./moment-timezone-with-data-10-year-range";

document.addEventListener("DOMContentLoaded", function () {
  var timeZones = {
    mapProp: null,
    map: null,
    x: document.getElementById("demo"),
    locations: [],

    addMarker(lat, lng) {
      this.locations[this.locations.length - 1].marker = new google.maps.Marker(
        {
          position: new google.maps.LatLng(lat, lng),
          map: this.map,
        }
      );
    },

    addListItem(lat, lng, tz) {
      // console.log("adding list item to HTML");
      // this.d = new Date();
      // this.n = this.d.getTime();

      // var newLocationTime = moment(this.n).tz(tz).format("hh:mm:ss"); //format: "ha z"

      var listItem = document.createElement("div");
      listItem.classList.add("card");
      listItem.innerHTML = `<div style="display: flex; justify-content: space-between;">
        <p class="pr-2">Lat: ${Math.round(lat)}, Lng: ${Math.round(lng)}</p>
        <b class="pl-2">${tz}</b>
        <b class="pl-2"></b>
        <span class="glyphicon glyphicon-remove"></span>
      </div>`;

      document.getElementById("locations").appendChild(listItem);
    },

    displayListItems() {
      var elLocations = document.getElementById("locations");
      elLocations.innerHTML = "";

      this.locations.forEach((location, i) => {
        console.log(location);

        var locationCard = document.createElement("div");
        locationCard.classList.add("card");
        console.log("i: ", i);
        locationCard.id = i;

        locationCard.innerHTML = `<div style="display: flex; justify-content: space-between;">
            <p class="pr-2">Lat: ${Math.round(location.lat)}, Lng: ${Math.round(
          location.lng
        )}</p>
            <b class="pl-2">${location.tz}</b>
            <b class="pl-2">${location.time}</b>
            <span class="glyphicon glyphicon-remove"></span>
          </div>`;

        elLocations.appendChild(locationCard);
      });
    },

    deletionEventListeners() {
      var plugin = this;

      var deleteIcons = document.querySelectorAll(".glyphicon");

      deleteIcons.forEach((deleteIcon) => {
        deleteIcon.addEventListener("click", function (e) {
          console.log(e);
          console.log(e.target.parentNode.parentNode.id);
          console.log(plugin);
          plugin.locations[e.target.parentNode.parentNode.id].marker.setMap(
            null
          );
          plugin.locations.splice(e.target.parentNode.parentNode.id, 1);

          plugin.displayListItems();
          plugin.deletionEventListeners();
        });
      });
      // glyphicon

      // var elLocations = document.getElementById("locations");
    },

    addLocation(lat, lng, tz) {
      var d = new Date();
      var n = d.getTime();

      var time = moment(n).tz(tz).format("hh:mm:ss"); //format: "ha z"
      // var time = 0;
      this.locations.push({ lat, lng, tz, time });
      this.addMarker(lat, lng);
      // this.addListItem(lat, lng, tz);

      this.displayListItems();

      this.deletionEventListeners();
    },

    getTimeZone: async function (lat, lng) {
      var tz = "";
      await fetch(
        `https://api.teleport.org/api/locations/${lat},${lng}/?embed=location:nearest-cities/location:nearest-city/city:timezone/tz:offsets-now%20|%20jq%20%27._embedded.%22location:nearest-cities%22[0]._embedded.%22location:nearest-city%22._embedded.%22city:timezone%22%27`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          tz =
            data._embedded["location:nearest-cities"][0]._embedded[
              "location:nearest-city"
            ]._embedded["city:timezone"].iana_name;
        });
      return tz;
    },

    async handleClick(event) {
      console.log("handleClick...");

      var plugin = this;

      var lat = event.latLng.lat();
      var lng = event.latLng.lng();

      let tz = await this.getTimeZone(lat, lng).then((tz) => {
        // console.log("tz from gettiemzone", tz);
        plugin.addLocation(lat, lng, tz);
      });
    },

    async showPosition(position) {
      // console.log("showPosition: this is ", this);
      this.x.innerHTML =
        "Latitude: " +
        position.coords.latitude +
        "<br>Longitude: " +
        position.coords.longitude;

      // console.log(this.map);
      this.map.setCenter(
        new google.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude
        )
      );

      // get timezone for the first list item...
      var tz = await this.getTimeZone(
        position.coords.latitude,
        position.coords.longitude
      );

      // update listItems
      this.addLocation(position.coords.latitude, position.coords.longitude, tz);
    },

    getLocation() {
      console.log(this);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
      } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
      }
    },

    myMap() {
      this.getLocation();
      this.mapProp = {
        center: new google.maps.LatLng(51.508742, -0.12085),
        zoom: 2,
      };
      this.map = new google.maps.Map(
        document.getElementById("googleMap"),
        this.mapProp
      );

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
      var myLocation = this.getLocation();
      console.log("myLocation: ", myLocation);
      this.myMap(myLocation); // this calls getLocation... should it?
    },
  };

  timeZones.init();
});

// to-do:
// use descriptive variable names
// clean up

class ProjectedObject {
    constructor(latlng, proj, radius) {
        this.proj = proj
        this.proj_centre = this.getCentre()   
        this.latLng = latlng     
        this.radius = radius
        this.coords = this.convertCoords()
        this.visibleCoords = this.getVisiblePoints()
        // this.info ?        
    }

    getCentre() {
        if (this.proj == "north") {
            return [90, 0]
        } else if (this.proj == "south") {
            return [-90, 0]
        } else if (this.proj == "meridian") {
            return [0, 0]
        } else if (this.proj == "antimeridian") {
            return [0, 180]
        } else if (this.proj == "offaxis") {
            return [45, 45]
        } else if (this.proj == "antioffexis") {
            return [-45, 215]
        } else {
            console.log("Invalid Projection!!")
            // raise InvalidProjection (TODO)
        }
    }

    isVisible(latlng) {
        if (this.proj == "north" && latlng.lat >= 0 && latlng.lat <= 90 && latlng.lng >= -90 && latlng.lng <= 90) {
            return true
        } else if (this.proj == "south" && latlng.lat >= -90 && latlng.lat <= 0 && latlng.lng >= -90 && latlng.lng <= 90) {
            return true
        } else if (this.proj == "meridian" && latlng.lat >= -90 && latlng.lat <= 90 && latlng.lng >= -90 && latlng.lng <= 90) {
            return true
        } else if (this.proj == "antimeridian" && latlng.lat >= -90 && latlng.lat <= 90 && 
        ((latlng.lng >= 90 && latlng.lng <= 180) || (latlng.lng >= -180 && latlng.lng <= -90))) { // TODO test the multi-line thing
            return true
        // } else if (this.proj == "offaxis") {
        //     return true
        // } else if (this.proj == "antioffexis") {
        //     return true
        } else {
            return false
        }
    }

    latlng_to_orthographic(latlng, radius, lat_centre, lng_centre) {
        // TODO add check to not allow out-of-range locations according to which map
        // degrees to radians 
        const lat = latlng.lat * Math.PI / 180
        const lng = latlng.lng * Math.PI / 180
        lat_centre = lat_centre * Math.PI / 180
        lng_centre = lng_centre * Math.PI / 180
        const x = radius * Math.cos(lat) * Math.sin(lng - lng_centre)
        const y = radius * (Math.cos(lat_centre) * Math.sin(lat) - Math.sin(lat_centre) * Math.cos(lat) * Math.cos(lng - lng_centre))
        // return [y, -x] // latlng
        return L.latLng(y, -x)
    }

    orthographic_to_latlng(x, y, radius, lat_centre, lng_centre) {
        const rho = Math.sqrt(x ** 2 + y ** 2)
        const c = Math.asin(rho/radius)
        const lat = Math.asin(Math.cos(c) * Math.sin(lat_centre) + (y * Math.sin(c) * Math.cos(lat_centre)) / rho)
        const lng = lng_centre + Math.atan((x * Math.sin(c)) / rho * Math.cos(c) * Math.cos(lat_centre) - y * Math.sin(c) * Math.sin(lat_centre))
        return [lat, lng]
    }

    convertCoords() {
        return this.latlng_to_orthographic(this.latLng, this.radius, this.proj_centre[0], this.proj_centre[1])
    }

    getVisiblePoints() {
        if (this.isVisible(this.latLng)) {
            return this.latlng_to_orthographic(this.latLng, this.radius, this.proj_centre[0], this.proj_centre[1])
        }   
    }

    get visiblePoints() {
        return this.visibleCoords
    }
}

const skymapDir = "./images/";
const PlanckDir = skymapDir + "Planck_30GHz_galactic_4096/";
const HI4PIDir = skymapDir + "HI4PI_galactic_4096/";
const MRSDir = skymapDir + "2MRS_celestial_smooth0.5deg_4096/";
const WISEDir = skymapDir + "WISE_galactic_4096/";

const bounds = [[-100, 100], [100, -100]];
const projs = ["northpole", "southpole", "primemeridian", "antimeridian", "offaxis", "antioffaxis"];

const Lmaps = [];
var backgrounds = [];
for (let i = 0; i < projs.length; i++) {
    backgrounds[i] = L.imageOverlay(PlanckDir + projs[i] + ".png");
    // backgrounds[i] = L.imageOverlay('./images/2MRS.0_z_0.01.smooth.png'):

    console.log(PlanckDir + projs[i] + ".png");
    
    Lmaps[i] = L.map(projs[i] + 'Map', {
        crs: L.CRS.Simple, 
        minZoom: -5,
        layers: backgrounds[i]
    });

    backgrounds[i].addTo(Lmaps[i]);
    // Lmaps[i].fitBounds(bounds);

    var l1 = L.imageOverlay(HI4PIDir + projs[i] + ".png", bounds);
    var l2 = L.imageOverlay(MRSDir + projs[i] + ".png", bounds);
    var l3 = L.imageOverlay(WISEDir + projs[i] + ".png", bounds);

    var dataLayers = {
        "Planck": backgrounds[i],
        "HI4PI": l1,
        "2MRS": l2,
        "WISE": l3,
    };

    L.control.layers(dataLayers, null).addTo(Lmaps[i]);
  }


function onEachFeature(feature, layer) {
		var popupContent = "";

		if (feature.properties && feature.properties.popupContent) {
			popupContent += feature.properties.popupContent;
		}

		layer.bindPopup(popupContent);
	}

L.geoJSON(objects, {
		pointToLayer: function (feature, latlng) {
            // const ortho = latlng_to_orthographic(latlng.lat, latlng.lng, 100, 90, 0);
			// return L.marker(L.latLng(ortho[0], ortho[1])); 

            //feature. whatever property

            let point = new ProjectedObject(latlng, "north", 100)
            // return L.marker(point.coords);
            return L.marker(point.visiblePoints);
		},
		onEachFeature: onEachFeature
	}).addTo(Lmaps[0]);

// L.geoJSON(footprints, {
//         onEachFeature: onEachFeature
//     }).addTo(MRSmap2);

// L.geoJSON(des, {
//         onEachFeature: onEachFeature
//     }).addTo(MRSmap2);

function change_div(val) {
    /* alert("This is the new value: " + val) */
    var maps = document.getElementsByClassName("map");
    for (var i=0; i < maps.length; i++) {
        maps[i].style.visibility='hidden';
    }

    var selected_map = document.getElementById(val + 'Map');
    selected_map.style.visibility='visible';
}
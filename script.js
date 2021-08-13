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
        if (this.proj == "northpole") {
            return [90, 0]
        } else if (this.proj == "southpole") {
            return [-90, 0]
        } else if (this.proj == "primemeridian") {
            return [0, 0]
        } else if (this.proj == "antimeridian") {
            return [0, 180]
        } else if (this.proj == "offaxis") {
            return [45, 45]
        } else if (this.proj == "antioffaxis") {
            return [-45, 215]
        } else {
            console.log("Invalid Projection!!")
            // raise InvalidProjection (TODO)
        }
    }

    isVisible(latlng) {
        if (this.proj == "northpole" && latlng.lat >= 0 && latlng.lat <= 90 && latlng.lng >= -90 && latlng.lng <= 90) {
            return true
        } else if (this.proj == "southpole" && latlng.lat >= -90 && latlng.lat <= 0 && latlng.lng >= -90 && latlng.lng <= 90) {
            return true
        } else if (this.proj == "primemeridian" && latlng.lat >= -90 && latlng.lat <= 90 && latlng.lng >= -90 && latlng.lng <= 90) {
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
        // degrees to radians 
        const lat = latlng.lat * Math.PI / 180
        const lng = latlng.lng * Math.PI / 180
        lat_centre = lat_centre * Math.PI / 180
        lng_centre = lng_centre * Math.PI / 180
        const x = radius * Math.cos(lat) * Math.sin(lng - lng_centre)
        const y = radius * (Math.cos(lat_centre) * Math.sin(lat) - Math.sin(lat_centre) * Math.cos(lat) * Math.cos(lng - lng_centre))
        return L.latLng(y - this.radius, -x + this.radius)
        // return L.latLng(y, -x)
    }

    orthographic_to_latlng(x, y, radius, lat_centre, lng_centre) {
        // TODO
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

class ProjectedFootprint extends ProjectedObject {
    // store as leaflet polyugon
    // accept all leaflet info 

    constructor(latlng, proj, radius) {
        super(latlng, proj, radius);      
    }

    convertCoords() {
        let converted = []
        for (let i = 0; i < this.latlng.length; i++) {
            converted[i] = [];
            for (let j = 0; j < this.latlng[i].length; j++) {
                converted[i][j] = this.latlng_to_orthographic(this.latLng[i][j], this.radius, this.proj_centre[0], this.proj_centre[1]);
            }
        }
        return converted
    }

    getVisiblePoints() {
        let visPoints = [];
        for (let i = 0; i < this.latlng.length; i++) {
            visPoints[i] = [];
            for (let j = 0; j < this.latlng[i].length; j++) {
                if (this.latlng[i].isVisible()) {
                    visPoints[i][j] =  this.latlng_to_orthographic(this.latLng[i][j], this.radius, this.proj_centre[0], this.proj_centre[1])
                } 
            }
        }
        return visPoints
    }
}

const skymapDir = "./images/";
const PlanckDir = skymapDir + "Planck_30GHz_galactic_4096/";
const HI4PIDir = skymapDir + "HI4PI_galactic_4096/";
const MRSDir = skymapDir + "2MRS_galactic_smooth1deg_4096/";
const WISEDir = skymapDir + "WISE_galactic_4096/";

const bounds = [[-256, 0], [0, 256]];
const projs = ["northpole", "southpole", "primemeridian", "antimeridian", "offaxis", "antioffaxis"];

const Lmaps = [];
var backgrounds = [];
var popups = [];

for (let i = 0; i < projs.length; i++) {
    // backgrounds[i] = L.tileLayer(skymapDir + "MRS_" + projs[i] + "_tiles/{z}/{x}/{y}.png", {
    //     attribution: 'This is where the Attribution Goes',
    //     maxZoom: 5,
    // });
    backgrounds[i] = L.imageOverlay(MRSDir + projs[i] + ".png", bounds);
    
    Lmaps[i] = L.map(projs[i] + 'Map', {
        crs: L.CRS.Simple, 
        minZoom: 0,
        layers: backgrounds[i]
    });

    backgrounds[i].addTo(Lmaps[i]);
    Lmaps[i].fitBounds(bounds);
    // Lmaps[i].setView([0, 0], 2);
    Lmaps[i].setView([-128, 128], 1);


    // var l1 = L.tileLayer(skymapDir + "Hi4PI_" + projs[i] + "_tiles/{z}/{x}/{y}.png", {
    //     attribution: 'This is where the Attribution Goes',
    //     maxZoom: 5,
    // });
    // var l3 = L.tileLayer(skymapDir + "WISE_" + projs[i] + "_tiles/{z}/{x}/{y}.png", {
    //     attribution: 'This is where the Attribution Goes',
    //     maxZoom: 5,
    // });
    // var l2 = L.tileLayer(skymapDir + "Planck_" + projs[i] + "_tiles/{z}/{x}/{y}.png", {
    //     attribution: 'This is where the Attribution Goes',
    //     maxZoom: 5,
    // });
    var l1 = L.imageOverlay(HI4PIDir + projs[i] + ".png", bounds);
    var l2 = L.imageOverlay(PlanckDir + projs[i] + ".png", bounds);
    var l3 = L.imageOverlay(WISEDir + projs[i] + ".png", bounds);

    var dataLayers = {
        "2MRS": backgrounds[i],
        "HI4PI": l1,
        "Planck": l2,
        "WISE": l3, 
    }

    var GCs = L.layerGroup();
    var starss = L.layerGroup();
    var footprints = L.layerGroup();

    var overlayMaps = {
        "Globular Clusters": GCs,
        "Bright Stars": starss,
        "Footprints": footprints,
    };

    L.control.layers(dataLayers, overlayMaps).addTo(Lmaps[i]).expand();

    // const zero = L.marker([0, 0]).bindPopup("real 0, 0");
    // zero.addTo(Lmaps[i]);
    // const bottomright = L.marker([-256, 256]).bindPopup("real 0, 0");
    // bottomright.addTo(Lmaps[i]);

    L.geoJSON(globular_clusters, {
        pointToLayer: function (feature, latlng) {
            //feature. whatever property

            let point = new ProjectedObject(latlng, projs[i], 128);
            if (point.visiblePoints) {
                var marker = L.marker(point.visiblePoints);
                GCs.addLayer(marker);
                return marker;    
            }
        },
        onEachFeature: onEachFeature
    }); 

    L.geoJSON(stars, {
        pointToLayer: function (feature, latlng) {
            //feature. whatever property

            let point = new ProjectedObject(latlng, projs[i], 128);
            if (point.visiblePoints) {
                var marker = L.marker(point.visiblePoints);
                starss.addLayer(marker);
                return marker;   
            }
        },
        onEachFeature: onEachFeature
    }); 

    // L.geoJSON(des, {
    //     pointToLayer: function (feature, latlng) {
    //         //feature. whatever property

    //         let point = new ProjectedFootprint(latlng, projs[i], 128);
    //         if (point.visiblePoints) {
    //             var poly = L.polygon(point.visiblePoints);
    //             footprints.addLayer(poly);
    //             return poly;   
    //         }
    //     },
    //     onEachFeature: onEachFeature
    // });

    var rand = L.polygon([[-40, 60], [-30, 100], [-100, 130]]);
    rand.bindPopup("I'm a random polygon, but this is what a survey footprint will look like!");
    footprints.addLayer(rand);

    
  }
  change_div("northpole");



// L.geoJSON(footprints, {
//         onEachFeature: onEachFeature
//     }).addTo(MRSmap2);

// L.geoJSON(des, {
//         onEachFeature: onEachFeature
//     }).addTo(MRSmap2);

function change_div(val) {
    var maps = document.getElementsByClassName("map");
    for (var i=0; i < maps.length; i++) {
        maps[i].style.visibility='hidden';
    }

    var selected_map = document.getElementById(val + 'Map');
    selected_map.style.visibility='visible';
}

function onEachFeature(feature, layer) {
    var popupContent = "";

    if (feature.properties && feature.properties.popupContent) {
        popupContent += feature.properties.popupContent;
    }
    
    layer.bindPopup(popupContent);
}
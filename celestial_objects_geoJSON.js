var footprints = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [[0, 10], [5, 20], [20, 40], [10, 20], [5, -5]], 
                    [[-10, -10], [-10, -20], [-5, -15]]
            ]
            },
            "properties": {
                "popupContent": "This is an example survey footprints."
            },
            "id": 1
        } //,
        // {
        //     "type": "Feature",
        //     "geometry": {
        //         "type": "LineString",
        //         "coordinates": [
        //             [-105.0008225440979, 39.751891803969535],
        //             [-104.99820470809937, 39.74979664004068]
        //         ]
        //     },
        //     "properties": {
        //         "popupContent": "This is a free bus line that will take you across downtown."
        //     },
        //     "id": 2
        // },
        // {
        //     "type": "Feature",
        //     "geometry": {
        //         "type": "LineString",
        //         "coordinates": [
        //             [-104.99820470809937, 39.74979664004068],
        //             [-104.98689651489258, 39.741052354709055]
        //         ]
        //     },
        //     "properties": {
        //         "popupContent": "This is a free bus line that will take you across downtown.",
        //         "underConstruction": false
        //     },
        //     "id": 3
        // }
    ]
};

var objects = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "popupContent": "supposed to be at x: 50, y: 20"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [50, 20] // in geoJSON it's [x, y] while in leaflet it's (y, x)=latlng
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "supposed to be at lng: 0, lat: 0"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [0, 0]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "supposd to be at lng: -90, lat: -40"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [-90, -40]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "supposd to be at lng: 0, lat: 90"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [0, 90]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "supposd to be at lng: 90, lat: 50"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [50, 90]
            }
        }
    ]
};

var globular_clusters = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "popupContent": "Pal 5"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [0.8389, 45.856] // in geoJSON it's [x, y] while in leaflet it's (y, x)=latlng
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "NGC 5466"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [43.8, 74]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "NGC 288"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [129, -89]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "Pal 15"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [19, 24]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "Ter 4"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [356, 2]
            }
        }
    ]
};

var stars = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "popupContent": "Sirius"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [266, -8.6] // in geoJSON it's [x, y] while in leaflet it's (y, x)=latlng
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "Vega"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [66, 20]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "Betelgeuse"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [200, -8]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "Altair"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [48, -11]
            }
        },{
            "type": "Feature",
            "properties": {
                "popupContent": "Deneb"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [84, 1.7]
            }
        }
    ]
};
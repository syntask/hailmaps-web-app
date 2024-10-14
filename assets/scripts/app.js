// INIT

var firstSymbolId;
var clusterMarkers = true;


// COLOR RAMPS

const rampHail = [
    { value: -1, color: '#df9253', name: 'hail-icon-default' },
    { value: 0, color: '#ffff49', name: 'hail-icon-0' },
    { value: 0.5, color: '#e5ad1b', name: 'hail-icon-0.5' },
    { value: 1, color: '#e4751c', name: 'hail-icon-1' },
    { value: 1.5, color: '#e33e1d', name: 'hail-icon-1.5' },
    { value: 2, color: '#e11e33', name: 'hail-icon-2' },
    { value: 2.5, color: '#e01f6a', name: 'hail-icon-2.5' },
    { value: 3, color: '#df209f', name: 'hail-icon-3' }
];


const rampWind = [
    { value: -1, color: '#404B6D', name: 'wind-icon-default' },
    { value: 0, color: '#491fa3', name: 'wind-icon-0' },
    { value: 50, color: '#006299', name: 'wind-icon-50' },
    { value: 60, color: '#007e9e', name: 'wind-icon-60' },
    { value: 70, color: '#009aaa', name: 'wind-icon-70' },
    { value: 80, color: '#00bd9e', name: 'wind-icon-80' },
    { value: 90, color: '#00e55e', name: 'wind-icon-90' },
    { value: 100, color: '#bcf519', name: 'wind-icon-100' }
];


const rampTornado = [
    { value: -1, color: '#404B6D', name: 'tornado-icon-default' },
    { value: 0, color: '#006299', name: 'tornado-icon-0' },
    { value: 1, color: '#007e9e', name: 'tornado-icon-1' },
    { value: 2, color: '#009aaa', name: 'tornado-icon-2' },
    { value: 3, color: '#00bd9e', name: 'tornado-icon-3' },
    { value: 4, color: '#00e55e', name: 'tornado-icon-4' },
    { value: 5, color: '#bcf519', name: 'tornado-icon-5' }
];

//var queryDateTime = new Date(); // Set datetime object to system datetime
// For testing, set the datetime to 2023-08-12 00:00:00 UTC
var queryDateTime = new Date(2023, 7, 11, 0, 0, 0);

// Initialize S-Cal
const inputDate = document.getElementById('inputDate');
initSCal(inputDate, {
    value: queryDateTime,
    min: new Date(2023, 6, 1),
    max: new Date(2023, 8, 30),
    format: 'mm/dd/yy',
    persistant: false,
    showDots: true,
    onChangeFunction: "inputDateChange",
    onViewChangeFunction: "calendarViewChange",
});
function inputDateChange(data) {
    // Parse the date from the input
    const [month, day, year] = inputDate.value.split('/');
    // convert year from 2 digit to 4 digit
    const fullYear = year.length === 2 ? '20' + year : year;
    queryDateTime = new Date(fullYear, month - 1, day);
    updateLayers(false);
}
inputDate.value = queryDateTime.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });

// Demo function to change the colors of the dots on the calendar
function calendarViewChange(data) {
    const monthNode = data.currentMonthInView;
    const dateNodes = monthNode.querySelectorAll('.s-cal-date-primary.s-cal-date-enabled');

    // Reset the colors
    document.querySelectorAll('.s-cal-dot').forEach(dot => {
        dot.style.backgroundColor = '';
        dot.style.display = '';
    });


    dateNodes.forEach(dateNode => {
        const dateValue = dateNode.getAttribute('data-date-value');
        const dateNodeInner = dateNode.querySelector('.s-cal-date-inner');
        const dateNodeBottom = dateNodeInner.querySelector('.s-cal-date-bottom');
        const dotOne = dateNodeBottom.querySelector('.s-cal-dot.one');
        const dotTwo = dateNodeBottom.querySelector('.s-cal-dot.two');
        const dotThree = dateNodeBottom.querySelector('.s-cal-dot.three');


        // Get a random color value from rampHail
        const randomIndex1 = Math.floor(Math.random() * rampHail.length);
        const randomIndex2 = Math.floor(Math.random() * rampWind.length);
        const randomIndex3 = Math.floor(Math.random() * rampTornado.length);

        const randomColor1 = rampHail[randomIndex1].color.substring(1);
        const randomColor2 = rampWind[randomIndex2].color.substring(1);
        const randomColor3 = rampTornado[randomIndex3].color.substring(1);

        dotOne.style.backgroundColor = '#' + randomColor1;
        dotTwo.style.backgroundColor = '#' + randomColor2;
        dotThree.style.backgroundColor = '#' + randomColor3;

        // Randomly hide dots using a 50% chance
        if (Math.random() > 0.25) {
            dotOne.style.display = 'none';
        }
        if (Math.random() > 0.25) {
            dotTwo.style.display = 'none';
        }
        if (Math.random() > 0.125) {
            dotThree.style.display = 'none';
        }

    });
}


// INSPECTOR STUFF

// Array to store inspector data
var showInspector = true;
var inspectorData = {};
var inspectorTargetX = 0;
var inspectorTargetY = 0;
var inspectorX = 0;
var inspectorY = 0;

// Update on mouse move
document.addEventListener('mousemove', (e) => {
    // Set target positions to the mouse coordinates
    inspectorTargetX = e.clientX;
    inspectorTargetY = e.clientY;

    // Update the inspector data
    updateInspectorData();
});

// Loop to continuously update the inspector location smoothly
setInterval(() => {
    // Smoothly move the inspector towards the target position
    inspectorX += (inspectorTargetX - inspectorX) * 0.2; // Adjust 0.1 to control the smoothness
    inspectorY += (inspectorTargetY - inspectorY) * 0.2;

    // Update inspector position on the page
    document.getElementById('inspector').style.top = inspectorY + 8 + 'px';
    document.getElementById('inspector').style.left = inspectorX + 8 + 'px';
}, 16); // 60 FPS (~16ms per frame)


    function updateInspectorData() {
        
        // Update the inspector data
        if (Object.keys(inspectorData).length > 0 && showInspector) {
            const dataEntries = Object.values(inspectorData);
            document.getElementById('inspector').innerHTML = dataEntries.join('<br>');
            document.getElementById('inspector').style.display = '';
        } else {
            document.getElementById('inspector').innerHTML = '';
            document.getElementById('inspector').style.display = 'none';
        }
        
    }



    function replacePlaceholders(text, datetime) {
        // Define replacement patterns
        const replacements = {
            '{{YYYY}}': datetime.getUTCFullYear(),
            '{{mm}}': String(datetime.getUTCMonth() + 1).padStart(2, '0'), // Month is 0-based in JavaScript
            '{{dd}}': String(datetime.getUTCDate()).padStart(2, '0'),
            '{{HH}}': String(datetime.getUTCHours()).padStart(2, '0'),
            '{{MM}}': String(datetime.getUTCMinutes()).padStart(2, '0'),
            '{{SS}}': String(datetime.getUTCSeconds()).padStart(2, '0')
        };

        // Replace each placeholder with the corresponding date/time part
        for (const [placeholder, value] of Object.entries(replacements)) {
            text = text.replace(new RegExp(placeholder, 'g'), value);
        }

        return text;
    }


const iconDataURIs = {};
function initializeMarkers(map) {
    const addMarker = (name, color, template) => {
        let svg = '';

        if (template === undefined || template === 'empty') {
            svg = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;">
                <style type="text/css">
                    .pin{fill:${color};}
                </style>
                <path class="pin" d="M12,0C7,0,2.4,3.9,2.4,9.8c0,4,3.2,8.7,9.6,14.1c6.4-5.4,9.6-10.1,9.6-14.1C21.6,3.9,17,0,12,0z"/>
                </svg>
            `;
        }

        if (template === 'pinDot') {
            svg = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;">
                <style type="text/css">
                    .pin{fill:${color};}
                    .icon{fill:#FFFFFF;}
                </style>
                <path class="pin" d="M12,0C7,0,2.4,3.9,2.4,9.8c0,4,3.2,8.7,9.6,14.1c6.4-5.4,9.6-10.1,9.6-14.1C21.6,3.9,17,0,12,0z"/>
                <circle class="icon" cx="12" cy="9.6" r="2.4"/>
                </svg>
            `;
        }

        if (template === 'dot') {
            svg = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;">
                <style type="text/css">
                    .pin{fill:${color};}
                </style>
                <circle class="pin" cx="12" cy="12" r="12"/>
                </svg>
            `;
        }

        if (template === 'hailReport') {
            svg = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;">
                <style type="text/css">
                    .circle{fill:${color};}
                    .icon{fill:#FFFFFF;}
                </style>
                <circle class="circle" cx="12" cy="12" r="12"/>
                    <g>
                        <path class="icon" d="M9.6,14.9l-1.1,0.8c-0.2,0.2-0.3,0.4-0.2,0.7l0.4,1.3c0.1,0.3,0.3,0.4,0.6,0.4h1.4c0.3,0,0.5-0.2,0.6-0.4
                            l0.4-1.3c0.1-0.3,0-0.5-0.2-0.7l-1.1-0.8C10.1,14.7,9.8,14.7,9.6,14.9z"/>
                        <path class="icon" d="M16.5,8.4L15.3,9c-0.2,0.1-0.4,0.4-0.4,0.6l0.1,1.4c0,0.3,0.2,0.5,0.5,0.6l1.3,0.3c0.3,0.1,0.5-0.1,0.7-0.3
                            l0.7-1.2c0.1-0.2,0.1-0.5-0.1-0.7l-0.9-1C17.1,8.4,16.8,8.3,16.5,8.4z"/>
                        <path class="icon" d="M16.5,14.3l-1.4-0.1c-0.3,0-0.5,0.1-0.6,0.4L14,15.8c-0.1,0.2,0,0.5,0.2,0.7l1,0.9c0.2,0.2,0.5,0.2,0.7,0.1
                            l1.2-0.7c0.2-0.1,0.3-0.4,0.3-0.7l-0.3-1.3C17,14.5,16.8,14.3,16.5,14.3z"/>
                        <path class="icon" d="M12.8,13.6c-0.2,0-0.4-0.1-0.5-0.2L6.8,7.9c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l5.5,5.5
                            c0.3,0.3,0.3,0.8,0,1.1C13.2,13.5,13,13.6,12.8,13.6z"/>
                        <path class="icon" d="M14,8.1c-0.2,0-0.4-0.1-0.5-0.2L12,6.5c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0l1.4,1.4c0.3,0.3,0.3,0.8,0,1.1
                            C14.4,8,14.2,8.1,14,8.1z"/>
                        <path class="icon" d="M7.4,14.6c-0.2,0-0.4-0.1-0.5-0.2L5.5,13c-0.3-0.3-0.3-0.8,0-1.1s0.8-0.3,1.1,0L8,13.3c0.3,0.3,0.3,0.8,0,1.1
                            C7.8,14.6,7.6,14.6,7.4,14.6z"/>
                    </g>
                </svg>
            `;
        }

        if (template === 'windReport') {
            svg = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;">
                <style type="text/css">
                    .circle{fill:${color};}
                    .icon{fill:#FFFFFF;}
                </style>
                <circle class="circle" cx="12" cy="12" r="12"/>
                <path class="icon" d="M11.66355,17.71966c-0.35888,0-0.69252-0.08973-1.00095-0.26916
                    c-0.30841-0.17944-0.55794-0.42617-0.7486-0.74019c-0.12337-0.2243-0.12616-0.44861-0.00842-0.6729
                    c0.11776-0.2243,0.30001-0.33645,0.54673-0.33645c0.14579,0,0.27476,0.04486,0.38692,0.13458
                    c0.11215,0.08972,0.21308,0.19066,0.3028,0.3028c0.05608,0.0785,0.13177,0.13739,0.2271,0.17664
                    c0.09533,0.03925,0.19345,0.05887,0.29439,0.05887c0.19066,0,0.35047-0.06448,0.47944-0.19345
                    c0.12897-0.12897,0.19345-0.28878,0.19345-0.47944s-0.06448-0.35047-0.19345-0.47944
                    c-0.12897-0.12897-0.28878-0.19345-0.47944-0.19345H5.94389c-0.19066,0-0.35047-0.06448-0.47944-0.19345
                    c-0.12897-0.12897-0.19346-0.28878-0.19346-0.47944c0-0.19066,0.06448-0.35047,0.19346-0.47944
                    c0.12897-0.12899,0.28878-0.19347,0.47944-0.19347h5.71966c0.56075,0,1.03739,0.19626,1.42992,0.58879
                    c0.39253,0.39253,0.58879,0.86916,0.58879,1.42992c0,0.56075-0.19626,1.03739-0.58879,1.42992
                    C12.70094,17.5234,12.2243,17.71966,11.66355,17.71966z M5.94389,10.99065c-0.19066,0-0.35047-0.06448-0.47944-0.19345
                    c-0.12897-0.12897-0.19346-0.2888-0.19346-0.47944s0.06448-0.35047,0.19345-0.47944
                    c0.12897-0.12897,0.28878-0.19345,0.47944-0.19345h8.41127c0.28037,0,0.51869-0.09813,0.71496-0.29439
                    c0.19627-0.19626,0.29439-0.43458,0.29439-0.71496c0-0.28037-0.09813-0.51869-0.29439-0.71496
                    c-0.19626-0.19626-0.43459-0.29439-0.71496-0.29439c-0.17943,0-0.34766,0.04206-0.50467,0.12616s-0.28038,0.20467-0.37011,0.36167
                    c-0.0785,0.13458-0.17383,0.25514-0.28599,0.36168c-0.11214,0.10654-0.24673,0.15981-0.40374,0.15981
                    c-0.2243,0-0.40655-0.08411-0.54673-0.25234c-0.14017-0.16821-0.17663-0.34765-0.10934-0.53831
                    c0.15701-0.47103,0.44019-0.84954,0.84954-1.13553c0.40934-0.28599,0.86635-0.42897,1.37104-0.42897
                    c0.65048,0,1.20561,0.22991,1.66543,0.68973s0.68973,1.01495,0.68973,1.66543c0,0.65048-0.22991,1.20561-0.68973,1.66543
                    c-0.45982,0.45982-1.01495,0.68973-1.66543,0.68973C14.35516,10.99065,5.94389,10.99065,5.94389,10.99065z M17.34957,16.17198
                    c-0.2243,0.10093-0.44299,0.08691-0.65608-0.04206c-0.21309-0.12897-0.31963-0.31682-0.31963-0.56355
                    c0-0.15701,0.05327-0.28878,0.15981-0.39532c0.10654-0.10654,0.2271-0.19907,0.36168-0.27757
                    c0.15701-0.08972,0.27757-0.21308,0.36168-0.37009c0.08411-0.15701,0.12617-0.32524,0.12617-0.50467
                    c0-0.28037-0.09813-0.51869-0.29439-0.71496c-0.19625-0.19627-0.43456-0.29439-0.71494-0.29439H5.94389
                    c-0.19066,0-0.35047-0.06448-0.47944-0.19345c-0.12897-0.12899-0.19346-0.2888-0.19346-0.47946s0.06448-0.35047,0.19345-0.47944
                    c0.12897-0.12897,0.28878-0.19345,0.47944-0.19345h10.42996c0.65048,0,1.20561,0.22991,1.66543,0.68973
                    c0.45982,0.45982,0.68973,1.01497,0.68973,1.66543c0,0.47103-0.12337,0.90001-0.37009,1.28692S17.77573,15.98134,17.34957,16.17198z
                    "/>
                </svg>
            `;
        }

        if (template === 'tornadoReport') {
            svg = `
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;">
                <style type="text/css">
                    .circle{fill:${color};}
                    .icon{fill:#FFFFFF;}
                </style>
                <circle class="circle" cx="12" cy="12" r="12"/>
                <path class="icon" d="M7.07375,7.45628c0.43478-0.7139,2.33589-1.29263,5.21735-1.29263s4.74523,0.6875,5.21734,1.29263
                    c0.65217,0.8359-0.36739,2.81136-3.47823,4.73962c-2.65233,1.64405-4.60777,3.24304-3.04345,3.87788
                    c2.50564,1.01684,2.42757,2.22511,2.10779,2.90736c-0.09943,0.21214-0.40458,0.18349-0.48318-0.03722
                    c-0.14313-0.40192-0.46519-0.90726-1.18983-1.14664c-2.20483-0.72834-3.04345-1.29263-3.91301-2.15438
                    c-0.6578-0.65189-1.36572-2.70944,0.86956-4.73962C9.49039,9.89302,6.23957,8.82598,7.07375,7.45628L7.07375,7.45628z"/>
                </svg>
            `;
        }

        const encodedSVG = "data:image/svg+xml," + encodeURIComponent(svg);
        const icon = new Image(96, 96);
        icon.src = encodedSVG;
        icon.onload = () => {
            map.addImage(name, icon, { pixelRatio: 4 });
        };
        // Store the data URI for later use in popups
        iconDataURIs[name] = encodedSVG;
    };


    rampHail.forEach(({ value, color, name }, index) => {
        addMarker(name, color, 'hailReport');
    });


    rampWind.forEach(({ value, color, name }, index) => {
        addMarker(name, color, 'windReport');
    });

    rampTornado.forEach(({ value, color, name }, index) => {
        addMarker(name, color, 'tornadoReport');
    });

    addMarker('default-marker', '#0086F8', 'pinDot');

    addMarker('dot-badge', '#0086F8', 'dot');
}



function updateLayers(forceRedraw) {


    // Find the date 24 hours after the query date
    var targetDate24Hours = new Date(queryDateTime);
    targetDate24Hours.setUTCDate(targetDate24Hours.getUTCDate() + 1);

    // HAIL POLYGON LAYER

    let urlMESHMAX1440 = replacePlaceholders('https://hailmaps.s3.us-east-2.amazonaws.com/data/MRMS/MESHMAX1440/{{YYYY}}/{{mm}}/{{dd}}/{{HH}}{{MM}}{{SS}}/tiles/{z}/{x}/{y}.pbf', targetDate24Hours);

    if (map.getLayer('layerFillMESHMAX1440') && !forceRedraw) {
        map.getSource('srcMESHMAX1440').setTiles([urlMESHMAX1440]);
    } else {

        // Remove existine laters if they exist
        if (map.getLayer('layerFillMESHMAX1440')) {
            map.removeLayer('layerFillMESHMAX1440');
        }

        if (map.getLayer('layerStrokeMESHMAX1440')) {
            map.removeLayer('layerStrokeMESHMAX1440');
        }

        if (map.getSource('srcMESHMAX1440')) {
            map.removeSource('srcMESHMAX1440');
        }

        // Create the color map

        colorMap = [
            'step',
            ['get', 'value'],
        ];
        
        if (rampHail[0].value = -1) {
            colorMap.push(rampHail[0].color);
        }
        
        // Only push values from rampHail that are >= 0
        colorMap.push(...rampHail
            .filter(({ value }) => value >= 0)  // Filter out values below 0
            .flatMap(({ value, color }) => [value, color])
        );
        

        // Add the tile source
        map.addSource('srcMESHMAX1440', {
            type: 'vector',
            tiles: [urlMESHMAX1440],
            minzoom: 0,
            maxzoom: 6
        });

        // Add the fill layer
        map.addLayer({
            id: 'layerFillMESHMAX1440',
            type: 'fill',
            source: 'srcMESHMAX1440',
            'source-layer': 'layer',
            paint: {
                'fill-color': colorMap,
                'fill-opacity': 0.4,
                'fill-outline-color': 'rgba(0, 0, 0, 0)',
            }
        }, "Road labels");

        // Add the stroke layer
        map.addLayer({
            id: 'layerStrokeMESHMAX1440',
            type: 'line',
            source: 'srcMESHMAX1440',
            'source-layer': 'layer',
            paint: {
                'line-color': colorMap,
                'line-width': 1.5,
                'line-opacity': 0.8
            }
        }, "Road labels");

        map.on('mousemove', 'layerFillMESHMAX1440', function (e) {
            const id = 'layerFillMESHMAX1440';
            const value = e.features[0].properties.value;
            
            inspectorData[id] = `${value}" Hail (radar)`;

            updateInspectorData();
        });

        map.on('mouseleave', 'layerFillMESHMAX1440', function () {
            delete inspectorData['layerFillMESHMAX1440'];
            updateInspectorData();
        });
    }

        drawGeoJsonPointLayer(
            "WindReports",
            "Wind Reports",
            "Wind",
            "https://hailmaps.s3.us-east-2.amazonaws.com/data/SPC/SPCRPTS/WIND1440/{{YYYY}}/{{mm}}/{{dd}}/{{HH}}{{MM}}{{SS}}/data.geojson",
            rampWind,
            "",
            " MPH"
        );

        drawGeoJsonPointLayer(
            "HailReports",
            "Hail Reports",
            "Hail",
            "https://hailmaps.s3.us-east-2.amazonaws.com/data/SPC/SPCRPTS/HAIL1440/{{YYYY}}/{{mm}}/{{dd}}/{{HH}}{{MM}}{{SS}}/data.geojson",
            rampHail,
            "",
            `"`
        );

        drawGeoJsonPointLayer(
            "TornadoReports",
            "Tornado Reports",
            "Tornado",
            "https://hailmaps.s3.us-east-2.amazonaws.com/data/SPC/SPCRPTS/TORNADO1440/{{YYYY}}/{{mm}}/{{dd}}/{{HH}}{{MM}}{{SS}}/data.geojson",
            rampTornado,
            "EF-",
            ""
        );

        function drawGeoJsonPointLayer(layerId, name, itemName, dataUrl, ramp, valuePrefix, valueSuffix) {

            const url = replacePlaceholders(dataUrl, targetDate24Hours);
            const srcId = `src${layerId}`;

            if (map.getSource(srcId) && !forceRedraw) {
                map.getSource(srcId).setData(url);
            } else {

                const markerId = `layer${layerId}`;
                const clusterId = `layer${layerId}Cluster`;
                const clusterBadgeId = `layer${layerId}ClusterBadge`;
                const clusterLabelId = `layer${layerId}ClusterLabel`;

                // Remove existine laters if they exist
                if (map.getLayer(markerId)) {
                    map.removeLayer(markerId);
                }

                if (map.getLayer(clusterId)) {
                    map.removeLayer(clusterId);
                }

                if (map.getLayer(clusterBadgeId)) {
                    map.removeLayer(clusterBadgeId);
                }

                if (map.getLayer(clusterLabelId)) {
                    map.removeLayer(clusterLabelId);
                }

                if (map.getSource(srcId)) {
                    map.removeSource(srcId);
                }



                const markerMap = ['case'];
                if (ramp[0].value == -1) {
                    markerMap.push(['==', ['get', 'value'], "unknown"], ramp[0].name);
                }
                ramp.forEach(({ value, name }) => {
                    markerMap.push(['<=', ['get', 'value'], value], name);
                });
                if (ramp[0].value == -1) {
                    markerMap.push(ramp[0].name);
                }

                
                const clusterMap = ['case'];
                if (ramp[0].value == -1) {
                    clusterMap.push(['==', ['get', 'maxValue'], -1], ramp[0].name);
                }
                ramp.forEach(({ value, name }) => {
                    clusterMap.push(['<=', ['get', 'maxValue'], value], name);
                });
                if (ramp[0].value == -1) {
                    clusterMap.push(ramp[0].name);
                }


                // Add the GeoJSON source
                map.addSource(srcId, {
                    type: 'geojson',
                    data: url, 
                    cluster: clusterMarkers,
                    clusterRadius: 36,
                    clusterMaxZoom: 10,
                    clusterProperties: {
                        maxValue: ['max', ['coalesce', ['to-number', ['get', 'value'], -1], -1]],
                        minValue: ['min', ['coalesce', ['to-number', ['get', 'value'], -1], -1]]
                    }
                });

                // Cluster icon 
                map.addLayer({
                    id: clusterId,
                    type: 'symbol',
                    source: srcId,
                    filter: ['has', 'point_count'],
                    layout: {
                        'icon-image': clusterMap,
                        'icon-size': 1.2,
                        'icon-allow-overlap': false,
                        'icon-ignore-placement': false,
                        'icon-overlap': 'always',
                        'icon-anchor': 'center',
                    }
                });
                
                // Cluster badge
                map.addLayer({
                    id: clusterBadgeId,
                    type: 'symbol',
                    source: srcId,
                    filter: ['has', 'point_count'],
                    layout: {
                        'icon-image': 'dot-badge',
                        'icon-size': .8,
                        'icon-allow-overlap': false,
                        'icon-ignore-placement': false,
                        'icon-overlap': 'always',
                        'icon-offset': [14, -14]
                    }
                });

                // Cluster badge label
                map.addLayer({
                    id: clusterLabelId,
                    type: 'symbol',
                    source: srcId,
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': '{point_count}',
                        'text-font': ['San Francisco Display Bold', 'Arial Unicode MS Bold'],
                        'text-size': 12,
                        'text-offset': [.9, -.9],
                        'text-allow-overlap': false,
                        'text-ignore-placement': false,
                        'text-overlap': 'always',
                    },
                    paint: {
                        'text-color': '#ffffff'
                    }
                });

                // Individual marker
                map.addLayer({
                    id: markerId,
                    type: 'symbol',
                    source: srcId,
                    layout: {
                        'icon-image': markerMap,
                        'icon-size': 1.2,
                        'icon-allow-overlap': false,
                        'icon-ignore-placement': false,
                        'icon-overlap': 'always',
                        'icon-anchor': 'center'
                    }
                });

                // Popup details on click for markers
                map.on('click', markerId, function (e) {
                    const value = e.features[0].properties.value;
            
                    // Function to get icon name based on value and ramp
                    function getIconName(value, ramp) {
                        if (ramp[0].value == -1 && (value == -1 || value == 'unknown')) {
                            return ramp[0].name;
                        }
                        for (const { value: v, name } of ramp) {
                            if (value <= v) {
                                return name;
                            }
                        }
                        if (ramp[0].value == -1) {
                            return ramp[0].name; // Return default icon if no match
                        } else {
                            return 'default-marker'; // Or any default icon
                        }
                    }
            
                    const iconName = getIconName(value, ramp);
                    const iconDataURI = iconDataURIs[iconName];


                    // Get e.features[0].properties.time which is a UTC time/date in the format 2023-08-11 22:27:00 and convert it to local time
                    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    const localTimeOffset = new Date().getTimezoneOffset() / -60;
                    const localTime = new Date(e.features[0].properties.time);
                    localTime.setHours(localTime.getHours() + localTimeOffset);
                    // Format the local time as a string with formay HH:MM AM/PM
                    const localTimeStr = localTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                    if (value == -1 || value == 'unknown') {
                        titleStr = `${itemName} report`;
                    } else { 
                        titleStr = `${valuePrefix}${value}${valueSuffix} ${itemName} report`;
                    }

            
                new maplibregl.Popup()
                    .setLngLat(e.features[0].geometry.coordinates)
                    .setHTML(`
                        <div style="display: flex; align-items: center;">
                            <img src="${iconDataURI}" style="width: 32px; height: 32px; margin-right: 8px;" />
                            <h1 style="margin: 0;">${titleStr}</h1>
                        </div>
                        <p><b>Time: </b>${localTimeStr}</p>
                        <p>${e.features[0].properties.comments}</p>
                    `)
                    .addTo(map);
                });

                // Zoom in on click for cluster
                map.on('click', clusterId, function (e) {
                    const zoom = map.getZoom() + 3;
                    map.zoomTo(zoom, { center: e.features[0].geometry.coordinates });
                });


                map.on('mousemove', markerId, function (e) {
                    map.getCanvas().style.cursor = 'pointer';
        
                    // Get the value and unique ID of the hovered marker
                    const value = e.features[0].properties.value;
                    const key = markerId; // Use the marker's id as the key
        
                    // Add the value to inspectorData using the marker id as the key to avoid duplicates

                    if (value == -1 || value == 'unknown') {
                        inspectorData[key] = `${itemName} report`;
                    } else { 
                        inspectorData[key] = `${valuePrefix}${value}${valueSuffix} ${itemName} report`;
                    }
                    // Update the inspector display
                    updateInspectorData();
                });
        
                // Remove key:value pair from inspectorData when the mouse leaves the marker
                map.on('mouseleave', markerId, function (e) {
                    map.getCanvas().style.cursor = '';
        
                    // Get the id of the marker being hovered out
                    const key = markerId;
        
                    // Remove the value from inspectorData
                    delete inspectorData[key];
        
                    // Update the inspector display
                    updateInspectorData();
                });

                map.on('mousemove', clusterId, function (e) {
                    map.getCanvas().style.cursor = 'pointer';

                    // Add the value to inspectorData using the cluster id as the key to avoid duplicates
                    const key = clusterId;
                    // Value should be the max value of the cluster
                    const maxValue = e.features[0].properties.maxValue;
                    const minValue = e.features[0].properties.minValue;
                    const count = e.features[0].properties.point_count;

                    if (minValue == maxValue  && maxValue != -1) {
                        inspectorData[key] = `${valuePrefix}${maxValue}${valueSuffix} ${itemName} (${count} reports)`;
                    } else if (minValue == -1 && maxValue != -1) {
                        inspectorData[key] = `Up to ${valuePrefix}${maxValue}${valueSuffix} ${itemName} (${count} reports)`;
                    } else if (minValue == -1 && maxValue == -1) {
                        inspectorData[key] = `${itemName} (${count} reports)`;
                    } else {
                        inspectorData[key] = `${valuePrefix}${minValue} - ${maxValue}${valueSuffix} ${itemName} (${count} reports)`;
                    }

                    // Update the inspector display
                    updateInspectorData();
                });
                map.on('mouseleave', clusterId, function (e) {
                    map.getCanvas().style.cursor = '';

                    // Get the id of the cluster being hovered out
                    const key = clusterId;

                    // Remove the value from inspectorData

                    delete inspectorData[key];

                    // Update the inspector display

                    updateInspectorData();
                });

            }
        
        }
    }
    const apiKey = "uxGPO18AyvxUdEGKe02K";

    const basemapStreets = 'https://api.maptiler.com/maps/d856b495-1396-447c-80d5-0fd7fca006e0/style.json?key=uxGPO18AyvxUdEGKe02K';

    const basemapHybrid = 'https://api.maptiler.com/maps/3ced3330-18f8-46d3-957e-a57c168a6641/style.json?key=uxGPO18AyvxUdEGKe02K';

    const map = new maplibregl.Map({
        container: 'map',
        style: basemapStreets,
        center: [-88.13734351262877, 35.137451890638886],
        zoom: 4,
        TerrainControl: true
    });

    map.on('load', () => {

        let firstSymbolId;
        function getFirstSymbolId() {
            const layers = map.getStyle().layers;
            // Find the index of the first symbol layer in the map style
            for (let i = 0; i < layers.length; i++) {
                if (layers[i].type === 'symbol') {
                    firstSymbolId = layers[i].id;
                    break;
                }
            }
        }
        getFirstSymbolId();
        

        // Move the date input into the top left corner of the map
        document.querySelector('.maplibregl-ctrl-top-left').appendChild(document.getElementById('insertTopLeft'));

        // Append the layer panel to the control container
        document.querySelector('.maplibregl-control-container').appendChild(document.getElementById('layerPanel'));

        // Click listeners for the basemap style buttons
        document.getElementById('btnStreets').addEventListener('click', function () {
            map.setStyle(basemapStreets, { diff: true });

            // Wait for the style to load before updating the layers
            map.once('render', function () {
                getFirstSymbolId();
                updateLayers(true); // Re-add layers after style is loaded
                updateLayerVisibility();
            });

            document.getElementById('btnStreets').classList.add('active');
            document.getElementById('btnSatellite').classList.remove('active');
        });

        document.getElementById('btnSatellite').addEventListener('click', function () {
            map.setStyle(basemapHybrid, { diff: true });

            // Wait for the style to load before updating the layers
            map.once('render', function () {
                getFirstSymbolId();
                updateLayers(true); // Re-add layers after style is loaded
                updateLayerVisibility();
            });


            document.getElementById('btnSatellite').classList.add('active');
            document.getElementById('btnStreets').classList.remove('active');
        });

        chkHailRad = document.getElementById('chkHailRad');
        chkHailRpts = document.getElementById('chkHailRpts');
        chkWindRpts = document.getElementById('chkWindRpts');
        chkTornadoRpts = document.getElementById('chkTornadoRpts');
        // Show and hide layers based on the checkboxes
        chkHailRad.addEventListener('change', function () {
            updateLayerVisibility();
        });

        chkHailRpts.addEventListener('change', function () {
            updateLayerVisibility();
        });

        chkWindRpts.addEventListener('change', function () {
            updateLayerVisibility();
        });

        chkTornadoRpts.addEventListener('change', function () {
            updateLayerVisibility();
        });

        function updateLayerVisibility() {
            map.setLayoutProperty('layerFillMESHMAX1440', 'visibility', chkHailRad.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerStrokeMESHMAX1440', 'visibility', chkHailRad.checked ? 'visible' : 'none');

            map.setLayoutProperty('layerHailReports', 'visibility', chkHailRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerHailReportsCluster', 'visibility', chkHailRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerHailReportsClusterBadge', 'visibility', chkHailRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerHailReportsClusterLabel', 'visibility', chkHailRpts.checked ? 'visible' : 'none');

            map.setLayoutProperty('layerWindReports', 'visibility', chkWindRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerWindReportsCluster', 'visibility', chkWindRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerWindReportsClusterBadge', 'visibility', chkWindRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerWindReportsClusterLabel', 'visibility', chkWindRpts.checked ? 'visible' : 'none');

            map.setLayoutProperty('layerTornadoReports', 'visibility', chkTornadoRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerTornadoReportsCluster', 'visibility', chkTornadoRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerTornadoReportsClusterBadge', 'visibility', chkTornadoRpts.checked ? 'visible' : 'none');
            map.setLayoutProperty('layerTornadoReportsClusterLabel', 'visibility', chkTornadoRpts.checked ? 'visible' : 'none');
        }

        // Set cluster behavior based on the checkbox
        document.getElementById('chkClusterMarkers').addEventListener('change', function () {
            clusterMarkers = this.checked;
            updateLayers(true);
            updateLayerVisibility();
        });

        // Toggle inspector visibility
        document.getElementById('chkShowInspector').addEventListener('click', function () {
            showInspector = this.checked;
        });


        // Add loading indicator
        map.on('dataloading', function() {
            document.getElementById('loadingIndicator').style.display = 'block';
        });

        map.on('data', function(e) {
            if (e.dataType === 'source' && e.isSourceLoaded) {
                document.getElementById('loadingIndicator').style.display = 'none';
            }
        });

        initializeMarkers(map); // Calls the function which generates the markers for each color in the palette and adds them to the map context

        const gc = new maplibreglMaptilerGeocoder.GeocodingControl({
            apiKey,
            maplibregl,
            country: 'us',
            noResultsMessage: 'No results found.'
        });
    
        map.addControl(gc);

        // Add the collapsed class to the geocoder control to start
        geocoder = document.querySelector('.maplibregl-ctrl-geocoder');
        geocoder.classList.add('collapsed');
        geocoderButton = document.querySelector('.maplibregl-ctrl-geocoder form .input-group button');
        geocoderInput = document.querySelector('.maplibregl-ctrl-geocoder form .input-group input')
        geocoderClearButton = document.querySelector('.maplibregl-ctrl-geocoder form .input-group .clear-button-container button');
        
        geocoder.addEventListener('click', function() {
            if (geocoder.classList.contains('collapsed')) {
                geocoder.classList.remove('collapsed');
                geocoderInput.focus();
            }
        });

        geocoderInput.addEventListener('blur', function() {
            // Delay the collapse of the geocoder control to allow the click event to fire
            setTimeout(() => {
                // Check if the geocoderInput is focused
                if (!geocoderInput.matches(':focus')) {
                    geocoder.classList.add('collapsed');
                }
            }, 100);
        });

        // When enter is pressed, blur the input to trigger the blur event
        geocoderInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                setTimeout(() => {
                    geocoderInput.blur();
                }, 100);
            }
        });



        // Add zoom and rotation controls to the map.
        map.addControl(new maplibregl.NavigationControl());

        // Add geolocate control to the map.
        map.addControl(
            new maplibregl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            })
        );

                // Append the layer panel button to the top right corner of the map
                document.querySelector('.maplibregl-ctrl-top-right').appendChild(document.getElementById('btnLayerPanel'));
        
                // Show the layer panel when the button is clicked
                document.getElementById('btnLayerPanel').addEventListener('click', function() {
                    document.getElementById('layerPanel').classList.add('visible');
                });
        
                // Hide the layer panel when the user clicks outside of it
                document.addEventListener('mousedown', function(e) {
                    if (!document.getElementById('layerPanel').contains(e.target) && !document.getElementById('btnLayerPanel').contains(e.target)) {
                        document.getElementById('layerPanel').classList.remove('visible');
                    }
                });

        // TERRAIN (DISABLED)
        //map.addSource("terrain", {
            //type: "raster-dem",
            //url: "https://api.maptiler.com/tiles/terrain-rgb/tiles.json?key=uxGPO18AyvxUdEGKe02K"
        //});

        //map.setTerrain({
            //source: "terrain",
            //exaggeration: 2.5
        //});

        //map.addControl(new maplibregl.TerrainControl({
            //source: "terrain"
        //}));

        updateLayers(false);
    });
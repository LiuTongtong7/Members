// 2D Map
var map = null;
var initMap = function (center, zoom) {
    $('#earth').css('display', 'none');
    $('#map').css('display', 'block');
    if (map != null) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibXJjb2RlIiwiYSI6ImNpeDBmOG1uZTAxemoyem8wNDQ5bHI4eHQifQ.IRQi-r9ToWRxXZrBqlK0Iw';
    map = new mapboxgl.Map({
        'container': 'map',
        'style': 'mapbox://styles/mapbox/streets-v9',
        'hash': true,
        'center': center,
        'zoom': zoom
    });
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    addMarkersToMap(graduates);
};

var getPopup = function (university) {
    var html = '<div class="mypopup">\n<header class="university-info">\n' +
        '<div class="university-logo"><img src="images/' + university['abbr'] + '/logo.svg"></div>\n' +
        '<div class="university-text"><a class="university-name" href="' + university['url'] + '" target="_blank">' + university['name'] + '</a></div>\n' +
        '</header>\n' +
        '<section class="university-list">\n';
    university['members'].forEach(function (member) {
        html += '<div class="university-member">\n' +
            '<div class="member-avatar"><img src="images/' + university['abbr'] + '/avatars/' + member['avatar'] + '"></div>\n' +
            '<div class="member-name"><a href="' + member['url'] + '" target="_blank">' + member['name'] + '</a></div>\n' +
            '<div class="member-title">' + member['title'] + '</div>\n' +
            '</div>\n';
    });
    html += '</section>\n</div>\n';
    return html;
};

var addMarkersToMap = function (data) {
    var list_min = 0x3f3f3f3f, list_max = 0;
    for (var continent in data) {
        data[continent].forEach(function (university) {
            list_min = Math.min(list_min, university['members'].length);
            list_max = Math.max(list_max, university['members'].length);
        });
    }
    for (var continent in data) {
        data[continent].forEach(function (university) {
            var element = document.createElement('div');
            element.className = 'marker';
            element.style.backgroundImage = 'url(images/' + university['abbr'] + '/person.svg)';
            var scale = (university['members'].length - list_min) / (list_max - list_min);
            element.style.height = (scale * 2 + 2) + 'em';
            element.style.width = (scale * 2 + 2) / 2.25 + 'em';

            var popup = new mapboxgl.Popup()
                .setHTML(getPopup(university));

            new mapboxgl.Marker(element)
                .setLngLat([university['position'].longitude, university['position'].latitude])
                .setPopup(popup)
                .addTo(map);
        })
    }
};

// 3D Earth
var earth = null;
var initEarth = function (center, zoom) {
    $('#map').css('display', 'none');
    $('#earth').css('display', 'block');
    if (earth != null) return;

    var options = {atmosphere: true, center: center, zoom: zoom};
    earth = new WE.map('earth', options);
    // https://www.mapbox.com/studio/styles/mapbox/streets-v9/
    WE.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v9/tiles/256/{z}/{x}/{y}?' +
        'access_token=pk.eyJ1IjoibXJjb2RlIiwiYSI6ImNpeDBmOG1uZTAxemoyem8wNDQ5bHI4eHQifQ.IRQi-r9ToWRxXZrBqlK0Iw', {
        attribution: '© Mapbox © OpenStreetMap'
    }).addTo(earth);
    addMarkersToEarth(graduates);
};

var addMarkersToEarth = function (data) {
    var list_min = 0x3f3f3f3f, list_max = 0;
    for (var continent in data) {
        data[continent].forEach(function (university) {
            list_min = Math.min(list_min, university['members'].length);
            list_max = Math.max(list_max, university['members'].length);
        });
    }
    for (var continent in data) {
        data[continent].forEach(function (university) {
            var scale = (university['members'].length - list_min) / (list_max - list_min);
            var fontsize = parseInt($('#earth').css('font-size'));
            var marker = WE.marker([university['position'].latitude, university['position'].longitude],
                                    'images/' + university['abbr'] + '/person.svg',
                                    (scale * 2 + 2) * fontsize / 2.25, (scale * 2 + 2) * fontsize).addTo(earth);
            marker.bindPopup(getPopup(university), {closeButton: true});
        })
    }
};

// Switch between 2D and 3D
var bindSwitch = function () {
    $('#2D').click(function (e) {
        if ($('#showall').is(':visible')) {
            hideShowAll();
        }
        if (!$(this).hasClass('active')) {
            $('#3D').removeClass('active');
            $('#2D').addClass('active');
            initMap([146.5, 23.2], 1.52);
        }
    });
    $('#3D').click(function (e) {
        if ($('#showall').is(':visible')) {
            hideShowAll();
        }
        if (!$(this).hasClass('active')) {
            $('#2D').removeClass('active');
            $('#3D').addClass('active');
            initEarth([40, 116], 0);
        }
    });
};

// Set Showall
var hideShowAll = function () {
    $('#showall').fadeOut();
    $('#show-button').find('a').text('Show All');
};
var showShowAll = function () {
    $('#showall').fadeIn();
    $('#show-button').find('a').text('Close');
};
var initShowAll = function (data) {
    var html = '';
    for (var continent in data) {
        data[continent].forEach(function (university) {
            html += '<div class="university-panel">\n' +
                '<header class="university-info">\n' +
                '<div class="university-logo"><img src="images/' + university['abbr'] + '/logo.svg"></div>\n' +
                '<div class="university-text">\n' +
                '<a class="university-name" href="' + university['url'] + '" target="_blank">' + university['name'] + '</a>\n' +
                '<span class="university-address">' + university['address'] + '</span>\n' +
                '</div>\n' +
                '</header>\n' +
                '<section class="university-list">\n';
            university['members'].forEach(function (member) {
                html += '<div class="university-member">\n' +
                    '<div class="member-avatar"><img src="images/' + university['abbr'] + '/avatars/' + member['avatar'] + '"></div>\n' +
                    '<div class="member-name"><a href="' + member['url'] + '" target="_blank">' + member['name'] + '</a></div>\n' +
                    '<div class="member-title">' + member['title'] + '</div>\n' +
                    '</div>\n';
            });
            html += '</section>\n</div>\n';
        })
    }
    $('#showall').html(html);

    $('#show-button').click(function (e) {
        if ($('#showall').is(':visible')) {
            hideShowAll();
        } else {
            showShowAll();
        }
    });
};

$(document).ready(function () {
    bindSwitch();
    initShowAll(graduates);
    initMap([146.5, 23.2], 1.52);
    // initEarth([40, 116], 0);
    $(window).resize(function (e) {
        e.preventDefault();
    })
});

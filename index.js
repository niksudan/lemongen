// Get URL paramter
var get = function(param) {
    var parts = location.search.substring(1).split('&');
    var params = {};
    for (var i = 0; i < parts.length; i++) {
        var nv = parts[i].split('=');
        if (!nv[0]) continue;
        params[nv[0]] = nv[1] || true;
    }
    if (params[param] !== undefined) {
        if (param != 'text' || (param == 'text' && params[param] !== true)) {
            return params[param];
        }
    }
    return false;
}

// Checkbox check on load
var fields = ['text', 'talking', 'wild', 'smol'];
fields.forEach(function(field) {
    if (get(field)) {
        document.getElementById(field).checked = true;
        if (field == 'text') {
            document.getElementById(field).value = decodeURIComponent(get(field));
        }
    }
});

// Generation button
document.getElementById('generate').addEventListener('click', function() {
    var params = [];
    fields.forEach(function(field) {
        if (document.getElementById(field).checked || (field == 'text' && document.getElementById(field).value != '')) {
            params.push(encodeURIComponent(field) + '=' + encodeURIComponent(document.getElementById(field).value));
        }
    });
    window.location = 'index.html?' + params.join('&');
});

// Generate a random range
var range = function(min, max) {
    return min + (Math.random() * (max - min));
}

// Generate a random colour
var randColour = function() {
    var colours = [];
    for (var i = 0; i < 3; i++) {
        colours.push(parseInt(range(0, 255)));
    }
    return 'rgb(' + colours.join(',') + ')';
}

// Init canvas
var c = document.getElementById('canvas');
var ctx = c.getContext('2d');
ctx.fillStyle = randColour();
ctx.fillRect(0, 0, 512, 512);
ctx.fillStyle = 'white';

// Draw a circle
var circle = function(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.stroke();
}

// Draw a bezier curve
var bezier = function(x1, y1, x2, y2, offset) {
    ctx.moveTo(x1, y1);
    ctx.bezierCurveTo(x1, y1 + range(0, offset), x2, y2 + range(0, offset), x2, y2);
    ctx.stroke();
}

// Draw body and head
var headRadius = range(100, 200);
if (get('smol')) {
    headRadius = range(50, 100);
}
circle(256, 512 + range(0, headRadius), 256 + range(0, headRadius / 2));
circle(256, 256, headRadius);

// Init eyes
var eyeOffset = (headRadius / 2) + range(10, 30);
var eyeRadius = range(10, 40);

// Draw mouth
var mouthOffset = eyeOffset - eyeRadius - range(5, 20);
var chinOffset = range(5, 20);
if (get('talking')) {
    bezier(256 - mouthOffset, 256, 256 + mouthOffset, 256, range(0, -10));
    bezier(256 - mouthOffset, 256, 256 + mouthOffset, 256, range(-50, -100));
} else {
    bezier(256 - mouthOffset, 256, 256 + mouthOffset, 256, range(-10, -30));
}

bezier(256 - mouthOffset / 2, 256 + chinOffset, 256 + mouthOffset / 2, 256 + chinOffset, range(5, 10));

// Draw eyes
for (var i = -1; i <= 1; i += 2) {
    var eyeTilt = range(-12, 12);
    var radiusModifier = 0;
    if (get('wild')) {
        eyeTilt = range(-25, 25);
        radiusModifier = range(-5, 20);
    }
    circle(256 + (eyeOffset * i), 256 + eyeTilt, eyeRadius + radiusModifier);
}

// Draw text
if (get('text')) {
    ctx.font = '36px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillText(decodeURIComponent(get('text')), 256, 36 + range(10, 20));
}

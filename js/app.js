// -----------------------------------------------------------
// Do the Standard Scene Setup
var viewer = document.getElementById('viewer');
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, viewer.clientWidth/ viewer.clientHeight, 0.1, 1000 );
camera.position.z = 2;

var spotlight = new THREE.SpotLight();
spotlight.position.set(0,2000,2000);

scene.add(spotlight);	

var renderer = new THREE.WebGLRenderer({canvas: viewer, precision: 'lowp'});
renderer.setClearColor( 'hsl(250, 40%, 20%)' );
document.body.appendChild( renderer.domElement );

// -----------------------------------------------------------
// Define the 3D Image
var imgTex = new THREE.TextureLoader().load('./img/option1.png');
imgTex.minFilter = THREE.LinearFilter;
var imgMat = new THREE.SpriteMaterial({map: imgTex, color: 0xffffff});
var img = new THREE.Sprite(imgMat);


// -----------------------------------------------------------
// Drag the Image
// -----------------------------------------------------------
var option1 = document.getElementById('option1'); // Grab the image from the page
option1.ondragstart = function(){return false}; // Disable default image drag

// Detect mousedown event, initiate pointer tracking
var chosen = false;
option1.addEventListener('mousedown', function(){chosen = true}, false)

// Determine the Location of the Mouse within the Canvas Frame
function onDocumentMouseMove(event){
	if (chosen == true){
		if (event.target.id == 'viewer'){
			// NEED TO GET THE MOUSE COORDINATES HERE
			/*
				- Find page(global) coordinates of canvas
				- Normalize xy coords such that left side of canvas = -1, right = 1, top = 1, bottom = -1
				- Determine how much of the scene is visible given the camera coordinates
				- Convert the mouse coordinates to scene coordinates
				- Place sprite at location where mouse enters the scene
				- Use the DeltaX/Y values then to move the sprite
				- On mouse up, stop changing the sprite location
			*/
			var offsetLeft = event.target.offsetLeft;
			var offsetTop = event.target.offsetTop;

			var mouse = {};
			// On a normalized scale from -1 to 1
			mouse.x = ((event.clientX - event.target.offsetLeft) / event.target.clientWidth) * 2 - 1;
			mouse.y = - ((event.clientY - event.target.offsetTop) / event.target.clientHeight) * 2 + 1;
			// Adjusted to match the visible dimensions of the viewer
			mouse.x *= 0.5 * getViewerFOV().width;
			mouse.y *= 0.5 * getViewerFOV().height;

			img.position.set(mouse.x, mouse.y, 0);
			scene.add(img);
		}
	}
}
document.body.addEventListener('mousemove', onDocumentMouseMove, false);
document.body.addEventListener('mouseup', function(){chosen = false}, false);

// -----------------------------------------------------------
// Utility Functions
// -----------------------------------------------------------
// Get the field of view
function getViewerFOV(){
		var vFOV = camera.fov * Math.PI / 180;
		var height = 2 * Math.tan(vFOV / 2) * camera.position.z;

		var aspect = viewer.clientWidth / viewer.clientHeight;
		var width = height * aspect;
		return {'width': width, 'height': height};
}

// -----------------------------------------------------------
// Prepare to Render
var render = function () {
	requestAnimationFrame( render );

	renderer.render(scene, camera);
};
render();
var renderer = null, camera = null, scene = null, cube = null;
var duration = 5000;
var currentTime = Date.now();

function animate() {
  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now; 
  var fract = deltat/duration;
  var angle = Math.PI * 2 * fract;
  cube.rotation.y += angle;
}

function run() {
  requestAnimationFrame(function() { run(); });
  renderer.render(scene, camera);
  animate();
}

var canvas = document.getElementById("webglcanvas");
renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true});
renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(45, canvas.offsetWidth, canvas.offsetHeight, 1, 4000);
scene.add(camera);
var mapUrl = "../images/webgl-logo-256.jpg";
var map = THREE.ImageUtils.loadTexture(mapUrl);
var material = new THREE.MeshBasicMaterial({map:map});
var geometry = new THREE.CubeGeometry(2,2,2);
cube = new THREE.Mesh(geometry, material);
cube.position.z = -8;
cube.rotation.x = Math.PI / 5;
cube.rotation.y = Math.PI / 5;
scene.add(cube);

run();

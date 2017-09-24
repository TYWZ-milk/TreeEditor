/**
 * Created by Kevin on 2017/6/23.
 */
var canvas,width,height,renderer,scene,camera,controls,Orbitcontrols,updateCircle,add;
function init() {
    add=false;
    updateCircle=false;
    canvas = document.getElementById("canvas");
    width = window.innerWidth;
    height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({
        antialias:true,
        canvas:canvas
    });
    renderer.setSize(width,height);
    renderer.setClearColor(0xaaaaaa,1.0);

    scene = new THREE.Scene();
    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0,1,1).normalize();
    scene.add(light);
    light = new THREE.AmbientLight(0xffffff,1);
    scene.add(light);


    camera = new THREE.PerspectiveCamera(45,width/height,1,10000);
    camera.position.y = 20;
    camera.position.z = 20;

    controls = new THREE.TransformControls(camera,canvas);
    controls.addEventListener( 'change', render );
    controls.setMode("translate","rotate");
    scene.add(controls);

    Orbitcontrols = new THREE.OrbitControls( camera, renderer.domElement );

    initScene();

    initGUI();
    
    canvas.addEventListener("click",onclick);

    animate();
}
var mesh;
function initScene() {

    var geo = new THREE.PlaneGeometry(200,200,20,20);
    mesh = new THREE.Mesh(geo,new THREE.MeshLambertMaterial({
        wireframe:true,
        color:0x111111
    }));
    mesh.rotateX(-Math.PI/2);
    scene.add(mesh);
    rebuild();
}

var parameter = {
    x: 0, y: 30, z: 0,
    background:0xaaaaaa,
    seg:20,
    circleNum:10,
    treeRadius:3,
    rebuild:rebuild,
    showBranch:true,
    showWireframe:false
};
var parameter2 = {
    radius:2,
    height:2,
    length:4,
    phiInterval:90,
    thetaInterval:0,
    x:0,
    y:0,
    z:0,
    addBranch:addBranch
};
var branch = null;
var cs = [];
var circleMesh = new THREE.Group();
function rebuild() {

    scene.remove(branch);
    scene.remove(circleMesh);
    circleMesh = new THREE.Group();
    if(updateCircle==false) {
        cs = [];

        var circle = {radius: parameter.treeRadius, pos: new THREE.Vector3(0, 0, 0)};
        cs.push(circle);
        var circleNum = parameter.circleNum || 5;
        for(var i = 1;i < circleNum;i++){
            var nc = {};
            //  nc.radius = cs[i-1].radius - 1/(circleNum-1);

            nc.radius = cs[i-1].radius - circle.radius/(circleNum-1);
            nc.radius = nc.radius || 0.00001;
            nc.pos = new THREE.Vector3(Math.random()-0.5,2.5,Math.random()-0.5).add(cs[i-1].pos);
            cs.push(nc);
        }

    }

    drawBranch(cs);
    scene.add(circleMesh);
    scene.add(branch);
    updateCircle=false;
}

function addBranch(){
    add=true;
    circleMesh = new THREE.Group();

    cs = [];

    var circle = {radius: parameter2.radius/2, pos: new THREE.Vector3(0, (parameter2.height-1)*2.5, 0)};

    cs.push(circle);
    var circleNum = parameter2.length || 5;
    for(var i = 1;i < circleNum;i++){
        var nc = {};
        nc.radius = cs[i-1].radius - circle.radius/(circleNum-1);
        nc.radius = nc.radius || 0.00001;
        nc.pos = new THREE.Vector3(-1.5*Math.sin(parameter2.phiInterval/180*Math.PI)*Math.sin(parameter2.thetaInterval/180*Math.PI),1.5*Math.cos(parameter2.phiInterval/180*Math.PI),1.5*Math.sin(parameter2.phiInterval/180*Math.PI)*Math.cos(parameter2.thetaInterval/180*Math.PI)).add(cs[i-1].pos);
        cs.push(nc);
    }

    drawBranch(cs);
    scene.add(circleMesh);
    scene.add(branch);
    add=false;
}
function drawBranch() {
    var seg = parameter.seg || 10;
    var geo = new THREE.Geometry();
    for(var i = 0, l = cs.length; i < l; i ++){
        var circle = cs[i];
        var mesh = new THREE.Mesh(new THREE.CircleGeometry(circle.radius,seg));
        mesh.rotateX(-Math.PI/2);
        if(add) {
            mesh.rotateX((parameter2.phiInterval)/180*Math.PI);
            mesh.rotateY(parameter2.thetaInterval/180*Math.PI);
        }
        mesh.position.copy(circle.pos);
        circleMesh.add(mesh);

        for(var s=0;s<seg;s++){//for each point in the circle
            var rd = circle.radius;
            var pos = new THREE.Vector3(0,0,0);
            pos.x = rd*Math.sin(2*Math.PI/seg*s);
            pos.y = 0;
            pos.z = rd*Math.cos(2*Math.PI/seg*s);
            geo.vertices.push(pos.add(circle.pos));
        }
    }

    for(i=0;i<l-1;i++){
        for(s=0;s<seg;s++){
            var v1 = i*seg+s;
            var v2 = i*seg+(s+1)%seg;
            var v3 = (i+1)*seg+(s+1)%seg;
            var v4 = (i+1)*seg+s;

            geo.faces.push(new THREE.Face3(v1,v2,v3));
            geo.faceVertexUvs[0].push([new THREE.Vector2(s/seg,0),new THREE.Vector2((s+1)/seg,0),new THREE.Vector2((s+1)/seg,1)]);
            geo.faces.push(new THREE.Face3(v3,v4,v1));
            geo.faceVertexUvs[0].push([new THREE.Vector2((s+1)/seg,1),new THREE.Vector2((s)/seg,1),new THREE.Vector2((s)/seg,0)]);
        }
    }//add faces and uv
    geo.computeFaceNormals();
    branch = new THREE.Mesh(geo,new THREE.MeshLambertMaterial({
        // wireframe:true,
        color:0x804000,
        side:THREE.DoubleSide,
        map:THREE.ImageUtils.loadTexture("../textures/tree/branch01.png")
    }));

}
var gui;
var gui2;
function initGUI() {
    gui = new dat.gui.GUI();
    gui.remember(parameter);
    gui.addColor(parameter,"background").onFinishChange(function (e) {
        renderer.setClearColor(e,1.0);
    });
    gui.add(parameter,"seg").name("segmentation").min(0).max(30).step(1).listen();
    gui.add(parameter,"circleNum").name("number of circles").min(0).max(30).step(1).listen();
    gui.add(parameter,"treeRadius").name("radius of tree").min(1).max(5).step(1).listen();
    gui.add(parameter,"showBranch").name("show branch").onFinishChange(function (e) {
        if(branch)branch.visible = e;
    });
    gui.add(parameter,"showWireframe").name("show wireframe").onFinishChange(function (e) {
        if(branch)branch.material.wireframe = e;
    });
    gui.add(parameter,"rebuild");
    var folder1 = gui.addFolder('Position');
    var cubeX = folder1.add( parameter, 'x' ).min(-50).max(50).step(1).listen();
    var cubeY = folder1.add( parameter, 'y' ).min(0).max(50).step(1).listen();
    var cubeZ = folder1.add( parameter, 'z' ).min(-50).max(50).step(1).listen();
    folder1.open();

    cubeX.onChange(function(value)
    {   branch.position.x = value;
        circleMesh.position.x =value;});
    cubeY.onChange(function(value)
    {   branch.position.y = value;
        circleMesh.position.y =value;});
    cubeZ.onChange(function(value)
    {   branch.position.z = value;
        circleMesh.position.z =value;});
    gui2 = new dat.gui.GUI();
    gui2.remember(parameter2);
    gui2.add(parameter2,"radius").name("radius of branch").min(1).max(3).step(1).listen();
    gui2.add(parameter2,"length").name("number of circles").min(0).max(20).step(1).listen();
    gui2.add(parameter2,"height").name("height of branch").min(0).max(30).step(1).listen();
    gui2.add(parameter2,"phiInterval").name("inclination of branch").min(0).max(90).step(1).listen();
    gui2.add(parameter2,"thetaInterval").name("orientation of branch").min(0).max(360).step(1).listen();
    gui2.add(parameter2,"addBranch");
}


var mouse = new THREE.Vector2();
var selected = null;
var order;
function onclick(event) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );

    //屏幕和场景转换工具根据照相机，把这个向量从屏幕转化为场景中的向量
    vector.unproject(camera);

    //vector.sub( camera.position ).normalize()变换过后的向量vector减去相机的位置向量后标准化
    //新建一条从相机的位置到vector向量的一道光线
    var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObjects( circleMesh.children );
    if(intersects.length){
        selected = intersects[0].object;

        parameter2.x = selected.position.x;
        parameter2.y = selected.position.y;
        parameter2.z = selected.position.z;

        for(var i = 0, l = cs.length; i < l; i ++) {
            if( selected.position.x == cs[i].pos.x && selected.position.y == cs[i].pos.y && selected.position.z == cs[i].pos.z ){
                updateCircle=true;
                order=i;
                }
        }
        if(updateCircle==true){
            cs[order].pos.x=parameter2.x;
            cs[order].pos.y=parameter2.y;
            cs[order].pos.z=parameter2.z;
        }
      //  gui2.updateDisplay();
        controls.attach(selected);
    }else{
     //   gui2.domElement.hidden = true;
    }
}

function animate() {
    controls.update();
    Orbitcontrols.update();
    render();

    requestAnimationFrame(animate);
}

function render() {

    renderer.clear();
    renderer.render(scene,camera);
}
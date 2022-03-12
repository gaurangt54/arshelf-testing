import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

import { Row, Col, Container } from "react-bootstrap";

import { colors } from "./colors1";
import chair from "./chair3.glb"

import "./App.css";
import { useState, useEffect } from "react";

function App3() {
    var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10);
    camera.position.z = 8; //Farness

    var loaded = false;
    let initRotate = 0;
    
    const [model, setModel] = useState();
    const [arlink, setArlink] = useState();
    let h = Math.ceil(0.8 * window.innerHeight)

    let m = [];
    const [part, setPart] = useState();
    const [meshes, setMeshes] = useState();

    const [initScene, setScene] = useState();
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const material = new THREE.MeshStandardMaterial({color: 0x777777});

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, 350);
    renderer.shadowMap.enabled = true;

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.61);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.target.position.set( 0, 0, - 1 );
    dirLight.add( dirLight.target );
    dirLight.lookAt( -1,-1, 0 );
    dirLight.name = 'DirectionalLight';
    scene.add( dirLight );

    const MODEL_PATH = './chair.glb';
    console.log(MODEL_PATH)

    var loader = new GLTFLoader();
    useEffect(()=>{
      loader.load(MODEL_PATH, function(gltf){
        console.log("Loader", scene)
        var theModel = gltf.scene;
        theModel.traverse(o => {

          if (o.isMesh) {
            m.push(o.name)
          o.nameID = o.name; 
          o.castShadow = true;
          o.receiveShadow = true;
          o.material = material;
          }
        });
        theModel.scale.set(2, 2, 2);
        theModel.rotation.y = Math.PI;
        theModel.position.y = -1;
        scene.add(theModel);
        setModel(theModel);
        setMeshes(m)
        setScene(scene);
      }, undefined, function (error) {
        console.error(error);
      });

      animate();
      
    }, [])

    console.log(model)
    

    var controls = new OrbitControls(camera, renderer.domElement);
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 3;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    controls.autoRotateSpeed = 0.2;

    function animate() {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        if (model != null && loaded == false) {
            initialRotation();
            //DRAG_NOTICE.classList.add('start');
        }
    }

    

    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      var width = window.innerWidth;
      var height = window.innerHeight;
      var canvasPixelWidth = canvas.width / window.devicePixelRatio;
      var canvasPixelHeight = canvas.height / window.devicePixelRatio;

      const needResize =
          canvasPixelWidth !== width || canvasPixelHeight !== height;
      if (needResize) {
          renderer.setSize(width, 350, false);
      }
      return needResize;
  }

  function initialRotation() {
    initRotate++;
    if (initRotate <= 120) {
        model.rotation.y += Math.PI / 60;
    } else {
        loaded = true;
    }
}
 

    useEffect(() => {
        const r = renderer.domElement;
        if(document.getElementById("obj"))
        document.getElementById("obj").appendChild(r);
        
    }, [renderer]);


    const download = () => {
        const exporter = new GLTFExporter();
        console.log("Download", initScene);
        exporter.parse(
          initScene,
            function (result) {
                if (result instanceof ArrayBuffer) {
                    saveArrayBuffer(result, "scene.glb");
                } else {
                    const output = JSON.stringify(result, null, 2);
                    console.log(output);
                    saveString(output, "scene.gltf");
                }
            },
            function (error) {
                console.log(error);
            },
            {binary:true}
        );
    }

    const link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link);
    console.log("Link",link)

    function saveArrayBuffer(buffer, fileName) {
        save(new Blob([buffer], { type: "model/gltf-binary" }), fileName);
    }

    function saveString(text, filename) {
        save(new Blob([text], { type: "text/plain" }), filename);
    }

    function save(blob, fileName) {
        console.log("Blob" ,blob)
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        // link.click();
        console.log(link.href)
        setArlink(link.href)
    }
    
    const changeColor = (color) => {

      let new_mtl;
      if (color.texture) {

        let txt = new THREE.TextureLoader().load(color.texture);

        txt.repeat.set(color.size[0], color.size[1], color.size[2]);
        txt.wrapS = THREE.RepeatWrapping;
        txt.wrapT = THREE.RepeatWrapping;

        new_mtl = new THREE.MeshStandardMaterial({
        map: txt });

    } else  {
        new_mtl = new THREE.MeshStandardMaterial({
        color: parseInt('0x' + color.color),
        //shininess: color.shininess ? color.shininess : 10
     })
    }

    model.traverse(o => {
      if(o.isMesh && o.nameID!= null){
      if(o.name==part){
        o.material=new_mtl
      }
    }
    });
    
    }
   

    return (
        <div className="App">
          {arlink?
          <div>
            <h2>Model Viewer</h2>
            <model-viewer style={{height:"500px",width:"100%",backgroundColor:"#17171A!important"}} src={arlink} ios-src={arlink} ar alt='A 3D model of a robot' camera-orbit="-90deg" auto-rotate='' camera-controls='' background-color='#455A64'></model-viewer>
          </div>
          :<Container>
            <div style={{textAlign:"center"}}>
                
                <button onClick={download}>Download</button>
                {meshes && meshes.length!=0?
                  meshes.map((mesh)=>(
                    <button style={part===mesh?{backgroundColor:"#ffff00"}:null} onClick={()=>{setPart(mesh)}}>{mesh}</button>
                  ))
                :null}
                <Row>
                  {colors && colors.length!==0?
                  colors.map((color,index)=>(
                    <Col className="choose-color" 
                    style={color.texture?{backgroundImage:`url(${color.texture})`}:{backgroundColor:`#${color.color}`}} 
                    onClick={()=>changeColor(color)}
                    />
                  ))
                  :null}
                  
                </Row>
            </div>
            <div id="obj" style={{height:"70vh"}}></div>
            </Container>
            }
        </div>
    );
}

export default App3;

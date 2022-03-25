import { useState, useEffect, useContext } from "react";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";

import { Context } from "./Context.js";

function App2() {

    
    const [mainScene, getScene] = useContext(Context);
    const [arlink, setArlink] = useState();

    // var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 60);
    // camera.position.z = 5;

    // var loaded = false;
    // let initRotate = 0;
    

    // const renderer = new THREE.WebGLRenderer( { antialias: true } );
    // renderer.setSize(window.innerWidth, 350);
    // renderer.shadowMap.enabled = true;
    
    // // document.body.appendChild( renderer.domElement );

    // console.log(mainScene)

    // var controls = new OrbitControls(camera, renderer.domElement);
    // controls.maxPolarAngle = Math.PI / 2;
    // controls.minPolarAngle = Math.PI / 3;
    // controls.enableDamping = true;
    // controls.enablePan = false;
    // controls.dampingFactor = 0.1;
    // controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    // controls.autoRotateSpeed = 0.2;
    // // animation

    // function animate() {
    //     controls.update();
    //     renderer.render( mainScene, camera );
    //     requestAnimationFrame(animate);

    //     if (resizeRendererToDisplaySize(renderer)) {
    //         const canvas = renderer.domElement;
    //         camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //         camera.updateProjectionMatrix();
    //     }

    // }

    // function resizeRendererToDisplaySize(renderer) {
    //   const canvas = renderer.domElement;
    //   var width = window.innerWidth;
    //   var height = window.innerHeight;
    //   var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    //   var canvasPixelHeight = canvas.height / window.devicePixelRatio;

    //   const needResize =
    //       canvasPixelWidth !== width || canvasPixelHeight !== height;
    //   // if (needResize) {
    //   //     renderer.setSize(width, 350, false);
    //   // }
    //   return needResize;
    // }

 
    // useEffect(() => {
    //     const r = renderer.domElement;
    //     const t = document.getElementById("obj")
    //     if(t){
    //       t.appendChild(r);
    //       console.log("Obj", renderer)
    //     }
    // }, [renderer]);

    // animate();

    const download = () => {
        const exporter = new GLTFExporter();
        console.log(mainScene)
        console.log("Download", mainScene);
        exporter.parse(
        mainScene,
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
        console.log(link.href)
        setArlink(link.href)
    }

    useEffect(()=>{
        if(mainScene){
            download()
        }
    }, [mainScene])
    
    return <div>
        {arlink?
        <div>
           <h2>Model Viewer</h2>
           <model-viewer style={{height:"500px",width:"100%",backgroundColor:"#17171A!important"}} src={arlink} ios-src={arlink} ar alt='A 3D model of a robot' camera-orbit="-90deg" auto-rotate='' camera-controls='' background-color='#455A64'></model-viewer>
         </div> 
        :<>Wait</>}

    </div>;
}

export default App2;

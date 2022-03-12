import React from "react";
import chair from "./chair3.glb"

function App2() {
    return <div>
        <h2>Model viewer</h2>
        <model-viewer style={{height:"500px",width:"100%",backgroundColor:"#17171A!important"}} src={chair} ar alt='A 3D model of a robot' camera-orbit="-90deg" auto-rotate='' camera-controls='' background-color='#455A64'></model-viewer>
    </div>;
}

export default App2;

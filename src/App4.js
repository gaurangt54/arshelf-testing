import React, {useState, useEffect} from 'react'

function App4() {

    useEffect(()=>{
        document.getElementById("abc").innerHTML = "S"
    })

    return (
        <div id="abc">App4</div>
    )
}

export default App4
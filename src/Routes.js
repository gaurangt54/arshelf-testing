import React, {useState} from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import App2 from './App2'
import App3 from './App3'
import NameChanger from './NameChanger'

import { Context } from "./Context.js";

function Routes() {

  const [mainScene, getScene] = useState();

  return (
    <BrowserRouter>
      <Context.Provider value={[mainScene, getScene]}>
        <Route exact path="/" component={NameChanger} />
        <Route exact path="/app2" component={App2} />
        <Route exact path="/colorcustomizer" component={App3} />
      </Context.Provider>
        

    </BrowserRouter> 
  )
}

export default Routes
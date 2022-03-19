import React from 'react'
import {BrowserRouter, Route} from 'react-router-dom'
import App2 from './App2'
import App3 from './App3'
import App from './App'

function Routes() {
  return (
    <BrowserRouter>
        <Route exact path="/" component={App} />
        <Route exact path="/app2" component={App2} />
        <Route exact path="/app3/:ar" component={App3} />

    </BrowserRouter> 
  )
}

export default Routes
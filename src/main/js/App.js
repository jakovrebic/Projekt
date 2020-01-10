'use strict';
import React from 'react';
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import ElDataPage from './page/ElDataPage.js'
import HomePage from './page/HomePage.js'

export default class App  extends React.Component {
    render() {
        return (
          <HashRouter>
            <div>
              <h1>Linkovi</h1>
              <ul className="header">
                <li><NavLink to="/">Home</NavLink></li>
                <li><NavLink to="/eldata">El data</NavLink></li>
              </ul>
              <div className="content">
                <Route path="/eldata" component={ElDataPage}/>
              </div>
            </div>
          </HashRouter>
        );
      }
}



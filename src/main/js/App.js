import React from 'react';
import {
 BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import ElDataPage from './page/ElDataPage.js'
import HomePage from './page/HomePage.js'

export default class App  extends React.Component {
    render() {
        return (
          <Router>
            <div>
              <nav>
                  <ul className="header">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/eldata">El data</Link></li>
                  </ul>
              </nav>
              <Switch>
                <Route path="/eldata">
                  <ElDataPage />
                </Route>
                <Route path="/">
                  <HomePage />
                </Route>
              </Switch>
            </div>
          </Router>
        );
      }
}



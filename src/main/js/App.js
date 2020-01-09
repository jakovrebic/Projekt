import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import {ListData as ListElData} from "./component/eldata/ListElData.jsx";

function App() {
  return (
      <div className="container">
          <Router>
              <div className="col-md-6">
                  <h1 className="text-center" style={style}>Projekt</h1>
                  <Switch>
                      <Route path="/" exact component={ListElData} />
                      <Route path="/users" component={ListElData} />
                  </Switch>
              </div>
          </Router>
      </div>
  );
}

const style = {
    color: 'red',
    margin: '10px'
}

export default App;
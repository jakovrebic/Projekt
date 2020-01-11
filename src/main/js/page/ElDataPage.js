import React from 'react';
const when = require('when');
import ReactDOM from 'react-dom';
import ElDataList from '../component/eldata/ElDataList.js'
import CreateDialog from '../component/CreateDialog.js'
import client  from '../client.js';
import follow  from '../follow.js'; // function to hop multiple links by "rel"
import compareArrays from '../util.js'
var stompClient = require('../websocket-listener')

const root = '/api';
const elDataPath = "elDatas";

export default class ElDataPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {elDatas: [],attributes: [], links: {}, params:{size:2}, path: elDataPath};
        this.onCreate = this.onCreate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
        this.updateParamsAndPath = this.updateParamsAndPath.bind(this);
        this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
        this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
	}

	loadFromServer(params, path) {
        follow(client, root, [
            {rel: path, params: params}]
        ).then(elDatasCollection => {

             let profilePath = 'http://localhost:8090/api/profile/elDatas'
            //custom repository methods do no generate this (alps stuff -> prob solution: https://stackoverflow.com/questions/33397920/spring-data-rest-custom-json-schema-alps)
            if( elDatasCollection.entity._links.profile != null &&  elDatasCollection.entity._links.profile != undefined){
                let profilePath = elDatasCollection.entity._links.profile.href
            }
            return client({
                method: 'GET',
                path: profilePath,
                headers: {'Accept': 'application/schema+json'}
            }).then(schema => {
                this.schema = schema.entity;
                this.links = elDatasCollection.entity._links;
                return elDatasCollection;
            });

        }).then(elDatasCollection => {
            return elDatasCollection.entity._embedded.elDatas.map(elData =>
                    client({
                        method: 'GET',
                        path: elData._links.self.href
                    })
            );
        }).then(elDataPromises => {
            return when.all(elDataPromises);
        }).done(elDatas => {
            this.setState({
                    elDatas: elDatas,
                    attributes: Object.keys(this.schema.properties),
                    params: params,
                    path : path,
                    links: this.links
                });

        });
    }

    onCreate(newElData) {
		const self = this;
		follow(client, root, [elDataPath]).then(response => {
			return client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newElData,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [{rel: self.state.path, params: self.state.params}]);
		}).done(response => {
			if (typeof response.entity._links.last !== "undefined") {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		});
	}

	onDelete(elData) {
		client({method: 'DELETE', path: elData.entity._links.self.href}).done(response => {
			this.loadFromServer(this.state.params, this.state.path);
		});
	}

	onNavigate(navUri) {
	    console.log('Nav uri is: ' + navUri)
		client({
			method: 'GET',
			path: navUri
		}).then(elDataCollection => {
			this.links = elDataCollection.entity._links;

			return elDataCollection.entity._embedded.elDatas.map(elData =>
					client({
						method: 'GET',
						path: elData._links.self.href
					})
			);
		}).then(elDataPromises => {
			return when.all(elDataPromises);
		}).done(elDatas => {
			this.setState({
				elDatas: elDatas,
				attributes: Object.keys(this.schema.properties),
			    params: this.state.params,
                path : this.state.path,
				links: this.links
			});
		});
	}

	updateParamsAndPath(params, path) {
	    console.log(params)
	    console.log(path)
	    console.log("State is:" + this.state)
	    console.log("size is:" + this.state.params)
	    console.log("params are: " + compareArrays(params, this.state.params))
		//if (!compareArrays(params, this.state.params) || this.state.path !== path) {
		    console.log("loading data from server")
			this.loadFromServer(params, path);
		//}
	}



	refreshAndGoToLastPage(message) {
    		follow(client, root, [{
    			rel: this.state.path,
    			params: this.state.params
    		}]).done(response => {
    			if (response.entity._links.last !== undefined) {
    				this.onNavigate(response.entity._links.last.href);
    			} else {
    				this.onNavigate(response.entity._links.self.href);
    			}
    		})
    	}

    	refreshCurrentPage(message) {
    		follow(client, root, [{
    			rel: this.state.path,
    			params: this.state.params
    		}]).then(elDataCollection => {
    			this.links = elDataCollection.entity._links;
    			this.page = elDataCollection.entity.page;

    			return elDataCollection.entity._embedded.elDatas.map(elData => {
    				return client({
    					method: 'GET',
    					path: elData._links.self.href
    				})
    			});
    		}).then(elDataPromises => {
    			return when.all(elDataPromises);
    		}).then(elDatas => {
    			this.setState({
    				page: this.page,
    				elDatas: elDatas,
    				params: this.state.params,
                    path : this.state.path,
    				attributes: Object.keys(this.schema.properties),
    				links: this.links
    			});
    		});
    	}

	componentDidMount() {
		this.loadFromServer(this.state.params, this.state.path);
		stompClient.register([
        			{route: '/topic/newElData', callback: this.refreshAndGoToLastPage},
        			{route: '/topic/deleteElData', callback: this.refreshCurrentPage}
        ]);
	}


	render() {
		return (
			<div>
				<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
				<ElDataList elDatas={this.state.elDatas}
							  links={this.state.links}
                              params={this.state.params}
                              path={this.state.path}
							  attributes={this.state.attributes}
							  onNavigate={this.onNavigate}
							  onDelete={this.onDelete}
							  updateParamsAndPath={this.updateParamsAndPath}/>
			</div>
		)
	}
}
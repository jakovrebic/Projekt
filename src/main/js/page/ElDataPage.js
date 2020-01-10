'use strict';
import React from 'react';
const when = require('when');
import ReactDOM from 'react-dom';
import ElDataList from '../component/eldata/ElDataList.js'
import CreateDialog from '../component/CreateDialog.js'
import client  from '../client.js';
import follow  from '../follow.js'; // function to hop multiple links by "rel"
var stompClient = require('../websocket-listener')

//import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
//import {ListData as ListElData} from "./component/eldata/ListElData.jsx";

const root = '/api';

export default class ElDataPage extends React.Component {

	constructor(props) {
		super(props);
		this.state = {elDatas: [],attributes: [], pageSize: 2, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
        this.onCreate = this.onCreate.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onNavigate = this.onNavigate.bind(this);
       this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
       this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
	}

	loadFromServer(pageSize) {
    		follow(client, root, [
    			{rel: 'elDatas', params: {size: pageSize}}]
    		).then(elDatasCollection => {
    			return client({
    				method: 'GET',
    				path: elDatasCollection.entity._links.profile.href,
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
    				pageSize: pageSize,
    				links: this.links
    			});
    		});
    	}

    onCreate(newElData) {
		const self = this;
		follow(client, root, ['elDatas']).then(response => {
			return client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newElData,
				headers: {'Content-Type': 'application/json'}
			})
		}).then(response => {
			return follow(client, root, [{rel: 'elDatas', params: {'size': self.state.pageSize}}]);
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
			this.loadFromServer(this.state.pageSize);
		});
	}

	onNavigate(navUri) {
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
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}

	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}

	refreshAndGoToLastPage(message) {
    		follow(client, root, [{
    			rel: 'elDatas',
    			params: {size: this.state.pageSize}
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
    			rel: 'elDatas',
    			params: {
    				size: this.state.pageSize,
    				page: this.state.page.number
    			}
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
    				attributes: Object.keys(this.schema.properties),
    				pageSize: this.state.pageSize,
    				links: this.links
    			});
    		});
    	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
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
							  pageSize={this.state.pageSize}
							  attributes={this.state.attributes}
							  onNavigate={this.onNavigate}
							  onUpdate={this.onUpdate}
							  onDelete={this.onDelete}
							  updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}
import ReactDOM from 'react-dom';
import React from 'react';

export default class ElDataList extends React.Component{

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
	}

    handleInput(e) {
		e.preventDefault();
		const pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
		}
	}

	handleNavFirst(e){
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}
	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}
	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}
	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	render() {
		const elDatas = this.props.elDatas.map(eldata =>
			<ElData key={eldata.entity._links.self.href}
			eldata={eldata}
			attributes={this.props.attributes}
            onDelete={this.props.onDelete}/>
		);

		const navLinks = [];
        if ("first" in this.props.links) {
            navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
        }
        if ("prev" in this.props.links) {
            navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
        }
        if ("next" in this.props.links) {
            navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
        }
        if ("last" in this.props.links) {
            navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
        }

		return (
		<div>
		    <h1>Electric data</h1>
            Page size <input ref="pageSize" defaultValue={this.props.pageSize} onInput={this.handleInput}></input>
			<table>
				<tbody>
					<tr>
						<th>Price</th>
						<th>Volume</th>
						<th>Date</th>
						<th></th>
					</tr>
					{elDatas}
				</tbody>
			</table>
			<div>
                {navLinks}
            </div>
        </div>
		)
	}
}

export class ElData extends React.Component{


    constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.eldata);
	}

	render() {
		return (
			<tr>
				<td>{this.props.eldata.entity.price}</td>
				<td>{this.props.eldata.entity.volume}</td>
				<td>{ this.props.eldata.entity.time}</td>
                <td>
                    <button onClick={this.handleDelete}>Delete</button>
                </td>
			</tr>
		)
	}
}
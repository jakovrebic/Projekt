import ReactDOM from 'react-dom';
import React from 'react';

const defaultPath = 'elDatas'
const filteredSearch = 'elDatas/search/filtered-search'

export default class ElDataList extends React.Component{

	constructor(props) {
		super(props);
		console.log(props)
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handlePageSizeInput = this.handlePageSizeInput.bind(this);
		this.handleClearFilter = this.handleClearFilter.bind(this)
		this.handleFilterByPrice = this.handleFilterByPrice.bind(this)
		this.handleFilterByVolume = this.handleFilterByVolume.bind(this)
	}

    handleClearFilter(e){
        e.preventDefault();
        let params = []
        const pageSize = this.refs.pageSize.value;
        if (/^[0-9]+$/.test(pageSize)) {
            params = { size: pageSize}
        }
         this.props.updateParamsAndPath(params, defaultPath);
    }

    handleFilterByPrice(e) {
         e.preventDefault();
         let priceFrom = this.refs.priceFrom.value;
         let priceTo = this.refs.priceTo.value;
         if(priceFrom == null || priceFrom == undefined || priceFrom==""){
            priceFrom = 0
         }
         if(priceTo == null || priceTo == undefined || priceTo==""){
            priceTo = 9999//we can use Number.MAX_VALUE but that is overkill
         }
         let params = this.props.params;
         console.log(params)
         params['priceFrom'] = priceFrom*1 //convert to num
         params['priceTo'] = priceTo*1
         console.log(params)
         this.props.updateParamsAndPath(params, filteredSearch);
    }

    handleFilterByVolume(e) {
         e.preventDefault();
         let volumeFrom = this.refs.volumeFrom.value;
         let volumeTo = this.refs.volumeTo.value;
         if(volumeFrom == null || volumeFrom == undefined || volumeFrom==""){
            volumeFrom = 0
         }
         if(volumeTo == null || volumeTo == undefined || volumeTo==""){
            volumeTo = 999999999999999999999//we can use Number.MAX_VALUE but that is overkill
         }
         let params = this.props.params;
         console.log(params)
         params['volumeFrom'] = volumeFrom*1 //convert to num
         params['volumeTo'] = volumeTo*1
         console.log(params)
         this.props.updateParamsAndPath(params, filteredSearch);
    }

    handlePageSizeInput(e) {
		e.preventDefault();
		const pageSize = this.refs.pageSize.value;
		if (/^[0-9]+$/.test(pageSize)) {
		    console.log(this.props);
			let params = this.props.params;
			console.log(params)
			params['size'] = pageSize*1;
			console.log(params)
			this.props.updateParamsAndPath(params, this.props.path);
		} else {
			this.refs.pageSize.value = pageSize.substring(0, pageSize.length - 1);
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

            //Price from <input ref="priceFrom" defaultValue={this.props.priceFrom} onInput={this.handleInput}></input>
            //Price to <input ref="priceTo" defaultValue={this.props.priceTo} onInput={this.handleInput}></input>

		return (
		<div>
		    <h1>Electric data</h1>
            Page size <input   type="number" ref="pageSize" defaultValue={this.props.params['size']} onInput={this.handlePageSizeInput} min="1" step="1"></input>
            <br/>
            <div>
                Filter by price
                <input type="number" ref="priceFrom" defaultValue={this.props.params['priceFrom']} min="0" step="0.01"></input>
                <input type="number" ref="priceTo" defaultValue={this.props.params['priceTo']}  min="0.01" step="0.01"></input>
                <button onClick={this.handleFilterByPrice}>FilterByPrice</button>
            </div>
            <div>
                Filter by volume
                <input type="number" ref="volumeFrom" defaultValue={this.props.params['volumeFrom']} min="0" step="0.01"></input>
                <input type="number" ref="volumeTo" defaultValue={this.props.params['volumeTo']}  min="0.01" step="0.01"></input>
                <button onClick={this.handleFilterByVolume}>FilterByVolume</button>
            </div>
             <button onClick={this.handleClearFilter}>Clear filters</button>
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
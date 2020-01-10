import ReactDOM from 'react-dom';
import React from 'react';

export default class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		const newElData = {};
		this.props.attributes.forEach(attribute => {
			newElData[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newElData);
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = ''; // clear out the dialog's inputs
		});
		window.location = "#";
	}

	render() {
        var now = new Date();
           var utcString = now.toISOString().substring(0,19);
           var year = now.getFullYear();
           var month = now.getMonth() + 1;
           var day = now.getDate();
           var hour = now.getHours();
           var minute = now.getMinutes();
           var second = now.getSeconds();
           var localDatetime = year + "-" +
                             (month < 10 ? "0" + month.toString() : month) + "-" +
                             (day < 10 ? "0" + day.toString() : day) + "T" +
                             (hour < 10 ? "0" + hour.toString() : hour) + ":" +
                             (minute < 10 ? "0" + minute.toString() : minute) +
                             utcString.substring(16,19);
        //TODO modificiraj sa switch da se moze reusati
		const inputs = this.props.attributes.map(attribute =>
		    attribute === "time" ?
		    <p key={attribute}>
            	<input type="datetime-local" placeholder={attribute} ref={attribute} defaultValue={localDatetime} required />
            </p>
		    :
			<p key={attribute}>
				<input type="number" placeholder={attribute} ref={attribute} defaultValue="0.01" min="0.01" step="0.01" required />
			</p>
		);
		return (
			<div>
				<a href="#createDialog">Create</a>
				<div id="createDial" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}
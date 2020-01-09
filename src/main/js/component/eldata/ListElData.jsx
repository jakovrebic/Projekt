import React, { Component } from 'react'
import ApiService from "../../service/ApiService";

class ListData extends Component {

    constructor(props) {
        super(props)
        this.state = {
            eLDatas: [],
            message: null
        }
        this.deleteElData = this.deleteElData.bind(this);
        this.editElData = this.editElData.bind(this);
        this.addElData = this.addElData.bind(this);
        this.reloadElDataList = this.reloadElDataList.bind(this);
    }

    componentDidMount() {
        this.reloadElDataList();
    }

    reloadElDataList() {
        ApiService.fetchElData()
            .then((res) => {
                this.setState({eLDatas: res.data.result})
            });
    }

    deleteElData(id) {
        ApiService.deleteElData(id)
           .then(res => {
               this.setState({message : 'ElData deleted successfully.'});
               this.setState({eLDatas: this.state.eLDatas.filter(eLData => eLData.id !== id)});
           })

    }

    editElData(id) {
        window.localStorage.setItem("id", id);
        this.props.history.push('/edit-eldata');
    }

    addElData() {
        window.localStorage.removeItem("id");
        this.props.history.push('/add-eldata');
    }

    render() {
        return (
            <div>
                <h2 className="text-center">ElData Details</h2>
                <button className="btn btn-danger" onClick={() => this.addElData()}> Add ElData</button>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className="hidden">Id</th>
                            <th>Cijena</th>
                            <th>Volumen</th>
                            <th>Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.eLDatas.map(
                        elData =>
                                    <tr key={elData.id}>
                                        <td>{elData.price}</td>
                                        <td>{elData.volume}</td>
                                        <td>{elData.time}</td>
                                        <td>
                                            <button className="btn btn-success" onClick={() => this.deleteElData(elData.id)}> Delete</button>
                                            <button className="btn btn-success" onClick={() => this.editElData(elData.id)}> Edit</button>
                                        </td>
                                    </tr>
                            )
                        }
                    </tbody>
                </table>

            </div>
        );
    }

}

export default ListData;
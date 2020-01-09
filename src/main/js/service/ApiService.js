import axios from 'axios';

const ELDATA_API_BASE_URL = 'http://localhost:8090/elDatas';

class ApiService {

    fetchElDatas() {
        return axios.get(ELDATA_API_BASE_URL);
    }

    fetchElDataById(id) {
        return axios.get(ELDATA_API_BASE_URL + '/' + id);
    }

    deleteElData(id) {
        return axios.delete(ELDATA_API_BASE_URL + '/' + id);
    }

    addElData(data) {
        return axios.post(""+ELDATA_API_BASE_URL, data);
    }

    editElData(data) {
        return axios.put(ELDATA_API_BASE_URL + '/' + data.id, data);
    }

}

export default new ApiService();
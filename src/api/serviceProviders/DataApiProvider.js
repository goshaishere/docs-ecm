import CoreApi from "../CoreApi";

class DataApiProvider extends CoreApi {
  constructor() {
    super(process.env.VUE_APP_API_URL);
  }
}

export default DataApiProvider;

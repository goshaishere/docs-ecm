import DataApiProvider from "../serviceProviders/DataApiProvider";

class DocumentService extends DataApiProvider {
    async getAllDocuments(body) {
        return this.api.post("list", body)
      }

      async getOneDocument(id) {
        return this.api.get(`document/${id}`);
      }

      async getDescription() {
        return this.api.get("description");
      }

}

const documentService = new DocumentService();

export default documentService;

import { defineStore } from 'pinia';
import documentService from "src/api/services/documentService";

export const useDocumentStore = defineStore('document', {
  state: () => ({
    columnsState: JSON.parse(localStorage.getItem('descriptionColumnsState')) || [],
    descriptionAll: {},
    descriptionCurrent: [],
    documentList: {
      size: null,
      offset: null,
      atributes: []
    },
    documentListPagination: {
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 15
      // rowsNumber: xx if getting data from a server
    },
    currentDocument: {},

    getAllDocumentsRequest: {
      attributes: [],
      order: { 
        attr: "string",
        asc: true
      },
      size: 100,
      offset: 0
    }
  }),
  getters: {
    getTableRows: (state) => state.documentList.atributes,
    getTableColumns: (state) => {
      return state.columnsState
        .filter(el => el.isActive)
        .map(el => ({
          name: el.name,
          field:  el.name,
          label: el.russianName,
          sortable: true
        }));
    },
    getCurrentDocument: (state) => {
      return Object.entries(state.currentDocument).map(([fieldName, fieldValue]) => ({
        propName: state.descriptionAll[fieldName] || fieldName,
        propValue: fieldValue === null ? '-' : fieldValue
      }));
    },
  },
  actions: {
    async fetchDescription() {
      const description = await documentService.getDescription();
      this.descriptionAll = description;
    
      this.getAllDocumentsRequest.attributes = this.columnsState.length > 0
        ? this.columnsState.filter(item => item.isActive).map(item => item.name)
        : Object.keys(this.descriptionAll);
    },
    async initializeThreeByDescription() {
      if (this.columnsState.length === 0) {
        const descriptionState = Object.entries(this.descriptionAll).map(([fieldName, fieldValue]) => ({
          name: fieldName,
          russianName: fieldValue,
          isActive: true,
        }));
    
        this.columnsState = descriptionState;
        localStorage.setItem("descriptionColumnsState", JSON.stringify(descriptionState));
        this.getAllDocumentsRequest.attributes = Object.keys(this.descriptionAll);
      }
    },
    updateCurrentDescription(payload) {
      const activeColumns = payload.filter(item => item.isActive);
      const attributeNames = activeColumns.map(item => item.name);
    
      this.columnsState = payload;
      localStorage.setItem("descriptionColumnsState", JSON.stringify(payload));
      this.getAllDocumentsRequest.attributes = attributeNames;
    },
    async fetchDocumentList() {
      this.documentList = await documentService.getAllDocuments(this.getAllDocumentsRequest)
    },
    async fetchOneDocument(id) {
      this.currentDocument = await documentService.getOneDocument(id)
    },
    setDocumentListPagination(payload) {
      this.documentListPagination = payload
    }
  },
});

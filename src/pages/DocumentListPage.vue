<template>
  <q-page class="document-list-page">
    <div class="document-list-page__title">ECM-Consulting</div>
    <div class="document-list-page__actions row">
      <div class="document-list-page__filters row">
        <div>
          <q-btn-dropdown
            class="document-list-page__btn"
            outline
            color="primary"
            label="Действия"
          >
            <q-list>
              <q-item clickable v-close-popup @click="onTuneColumnsClick">
                <q-item-section>
                  <q-item-label>Настроить колонки</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <div class="document-list-page__input-wrap">
          <q-input
            class="document-list-page__input"
            outlined
            color="primary"
            placeholder="Поиск"
            v-model="searchInput"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div>
          <q-btn-dropdown
            class="document-list-page__btn"
            outline
            color="primary"
            label="Фильтр"
          >
            <q-list>
              <q-item clickable v-close-popup @click="onFilterClick">
                <q-item-section>
                  <q-item-label>Фильтр 1</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onFilterClick">
                <q-item-section>
                  <q-item-label>Фильтр 2</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="onFilterClick">
                <q-item-section>
                  <q-item-label>Фильтр 3</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </div>
      <div>
        <q-btn
          class="document-list-page__btn"
          color="primary"
          label="Открыть"
        />
      </div>
    </div>
    <q-table
      flat
      bordered
      :rows="documentStore.getTableRows"
      :columns="documentStore.getTableColumns"
      row-key="r_object_id"
      :selected-rows-label="getSelectedString"
      selection="multiple"
      v-model:selected="selectedTableRows"
      :rows-per-page-options="[5, 10, 15, 20, 25, 50, 100]"
      :pagination="documentStore.documentListPagination"
      @update:pagination="onPaginationUpdate"
      @row-click="onTableRowClick"
    />

    <q-dialog v-model="isTuneColumnsShow" persistent>
      <q-card class="columns-tuning-dialog">
        <q-card-section>
          <div class="text-h6">Настройка колонок</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-list>
            <q-item
              v-for="(item, index) in columnsStateLocal"
              :key="index"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-toggle color="primary" v-model="item.isActive" />
              </q-item-section>

              <q-item-section>{{ item.russianName }}</q-item-section>
              <q-item-section right>{{ item.name }}</q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" @click="updateColumns" />
          <q-btn flat label="Отмена" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, watchEffect, onMounted } from "vue";
import { useDocumentStore } from "src/stores/document-store";
import { useRouter } from "vue-router";
import { cloneDeep } from "lodash";

const router = useRouter();
const documentStore = useDocumentStore();

const selectedTableRows = ref([]);
const searchInput = ref("");
const isTuneColumnsShow = ref(false);
let columnsStateLocal = reactive([]);

const getSelectedString = () => {
  return selectedTableRows.value.length === 0
    ? ""
    : `${selectedTableRows.value.length} элемент${
        selectedTableRows.value.length > 1
          ? selectedTableRows.value.length >= 2 &&
            selectedTableRows.value.length <= 4
            ? "а"
            : "ов"
          : ""
      } выбрано из ${documentStore.getTableRows.length}`;
};

const onTableRowClick = (evt, row) => {
  router.push({ name: "document", params: { id: row.r_object_id } });
};

const onTuneColumnsClick = () => {
  isTuneColumnsShow.value = true;
};

const onFilterClick = () => {
  isTuneColumnsShow.value = true;
};

const onPaginationUpdate = (newVal) => {
  documentStore.setDocumentListPagination(newVal);
};

const updateColumns = () => {
  documentStore.updateCurrentDescription(columnsStateLocal);
  isTuneColumnsShow.value = false;
  documentStore.fetchDocumentList();
};

watchEffect(() => {
  columnsStateLocal = reactive(cloneDeep(documentStore.columnsState));
});

onMounted(async () => {
  await documentStore.fetchDescription();
  await documentStore.initializeThreeByDescription();
  await documentStore.fetchDocumentList();
});
</script>


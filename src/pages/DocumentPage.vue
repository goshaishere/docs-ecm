<template>
  <q-page class="document-page">
    <div class="document-page__go-back-btn">
      <q-btn @click="router.push('/')" color="primary" label="Назад к списку" />
    </div>
    <q-card class="document-page__card">
      <q-card-section>
        <q-list>
          <q-item
            v-for="(property, index) in documentStore.getCurrentDocument"
            :key="index"
          >
            <q-item-section>
              <q-item-label>{{ property.propName }}</q-item-label>
            </q-item-section>

            <q-item-section class="document-page__attr-description" side>
              <q-item-label caption>{{ property.propValue }}</q-item-label>
            </q-item-section>
            <q-separator />
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-page>
</template>


<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDocumentStore } from "src/stores/document-store";

const router = useRouter();
const documentStore = useDocumentStore();

onMounted(() => {
  documentStore.fetchOneDocument(router.currentRoute._value.params.id);
});
</script>

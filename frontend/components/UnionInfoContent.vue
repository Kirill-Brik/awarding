<template>
  <ul class="union__info__container__right__content">
    <li class="union__info__container__right__content__item">
      <span v-if="union.status === 'disable' || union.transaction_hash"
            class="union__info__container__right__content__item__label"
      >Дата: </span>
      <span v-else-if="union.status === 'confirm'" class="union__info__container__right__content__item__label"
      >Дата принятия: </span>
      <span v-else-if="union.status === 'not_confirm'" class="union__info__container__right__content__item__label"
      >Дата отклонения: </span>
      <span class="union__info__container__right__content-item-value">{{ formattedDate }}</span>
    </li>
    <li v-if="union.contract" class="union__info__container__right__content__item">
      <span class="union__info__container__right__content__item__label"
      >TxID: </span>
      <span class="union__info__container__right__content__item__value">{{ truncatedText(union.contract) }}
        <img alt="Copy" class="copy-icon" src="../assets/images/copy.svg"
             @click="copyToClipboard(union.contract, 'contract')">
        <span v-if="copiedField === 'contract'" class="copy-notification">Скопировано</span>
      </span>
    </li>
    <li v-if="union.transaction_hash" class="union__info__container__right__content__item">
      <span class="union__info__container__right__content__item__label"
      >Адрес: </span>
      <span class="union__info__container__right__content__item__value">{{ truncatedText(union.transaction_hash) }}
        <img alt="Copy" class="copy-icon" src="../assets/images/copy.svg"
             @click="copyToClipboard(union.transaction_hash, 'transaction_hash')">
        <span v-if="copiedField === 'transaction_hash'" class="copy-notification">Скопировано</span>
      </span>
    </li>
  </ul>
</template>

<script setup>
import {computed, ref} from 'vue';

const props = defineProps({
  union: {
    type: Object,
    required: true,
  }
});

const copiedField = ref('');

const formattedDate = computed(() => {
  const date = new Date(props.union.status === 'disable' ? props.union.createdAt : props.union.confirm_date);
  return date.toLocaleDateString('ru-RU');
});

function truncatedText(text) {
  return text && text.length > 25 ? `${text.slice(0, 13)}...` : text;
}

function copyToClipboard(text, field) {
  navigator.clipboard.writeText(text).then(() => {
    copiedField.value = field;
    setTimeout(() => {
      copiedField.value = '';
    }, 2000);
  });
}
</script>

<style scoped>
.copy-icon {
  margin-left: 10px;
  cursor: pointer;
  position: relative;
}

.copy-notification {
  font-size: 12px;
  font-weight: 500;

  color: rgba(0, 18, 33, 1);
  margin-left: 10px;
  position: absolute;
  border: 1px solid rgba(190, 190, 190, 1);
  border-radius: 5px;
  padding: 4px 8px;
  background-color: rgba(255, 255, 255, 1);

}
</style>

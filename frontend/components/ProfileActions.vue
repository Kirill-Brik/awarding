<template>
  <div class="actions">
    <div class="actions__header">
      <h3 class="actions__title">Мир возможностей</h3>
      <h4 class="actions__description">Специальные предложения от партнеров<br> только для VTB.family.</h4>
      <div class="actions__nav">
        <ElIcon class="actions__nav-button actions__nav-button_prev" :size="12">
          <IconsArrowLeft/>
        </ElIcon>
        <ElIcon class="actions__nav-button actions__nav-button_next" :size="12">
          <IconsArrowRight/>
        </ElIcon>
      </div>
    </div>
    <div class="actions__wrapper">
      <ClientOnly>
        <swiper
            v-if="isShowSwiper"
            :breakpoints="{
            0: {
              slidesPerView: 1.9,
              spaceBetween: 10
            },
            [viewport.breakpointValue('sm')]: {
              slidesPerView: 3.3,
              spaceBetween: 16
            }
          }"
            :modules="[Grid, Scrollbar, Navigation]"
            :grid="{ rows: 2, fill: 'row' }"
            :scrollbar="{ el: '.actions__scroll' }"
            class="actions__swiper"
            :navigation="{ prevEl: '.actions__nav-button_prev', nextEl: '.actions__nav-button_next' }"
        >
          <swiper-slide v-for="(slide, index) in slides" :key="index">
            <div :style="{ backgroundImage: `url(${slide.image})` }" @click="slide.handler" class="actions__item"
                      :class="{'actions__item_disabled': slide.disabled}">
              <span>{{ slide.label }}</span>
            </div>
          </swiper-slide>
        </swiper>
      </ClientOnly>
    </div>
    <div class="actions__scroll-wrapper">
      <div class="actions__scroll"></div>
    </div>
    <VoucherModal v-model="isShowVoucher" :img="voucherImg" :aspect-ratio="aspectRatio"/>
  </div>
</template>


<script setup>
import {Grid, Navigation, Scrollbar} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/vue';
import trips from '~/assets/images/profile_actions/trips.jpg';
import gastro from '~/assets/images/profile_actions/gastro.jpg';
import banks from '~/assets/images/profile_actions/banks.jpg';
import insurance from '~/assets/images/profile_actions/insurance.jpg';
import gos from '~/assets/images/profile_actions/gos.jpg';
import ring from '~/assets/images/profile_actions/ring.jpg';
import car from '~/assets/images/profile_actions/car.jpg';
import telecom from '~/assets/images/profile_actions/telecom.jpg';
import aparts from '~/assets/images/profile_actions/aparts.jpg';
import jku from '~/assets/images/profile_actions/JKU.jpg';
import med from '~/assets/images/profile_actions/med.jpg';
import sellers from '~/assets/images/profile_actions/sellers.jpg';
import childs from '~/assets/images/profile_actions/childs.jpg';
import flowers from '~/assets/images/profile_actions/flowers.jpg';
import restaurants from '~/assets/images/profile_actions/restaurants.jpg';
import flowersVaucher from '~/assets/images/profile_actions/flowers_vaucher.jpg'
import presents from '~/assets/images/profile_actions/presents.jpg'
import spa from '~/assets/images/profile_actions/spa.jpg'
import fitnes from '~/assets/images/profile_actions/fitnes.jpg'

import VoucherModal from "~/components/VoucherModal.vue";

const viewport = useViewport();
const unionsStore = useUnionsStore();
const isShowSwiper = ref(true)

const isConfirmedUnion = computed(() => !!unionsStore.unions.find((union) => union.status === 'confirm'));
const isBlockchainUnion = computed(() => !!unionsStore.unions.find((union) => union.status === 'confirm' && union.transaction_hash));


const slides = computed(() => [
  {image: flowers, label: 'Цветы', handler: () => showVoucher(flowersVaucher, 842 / 595), disabled: false},
  {image: gastro, label: 'Гастрономия', handler: () => {}, disabled: false},
  {image: ring, label: 'Ювелирные магазины', handler: () => {}, disabled: false},
  {image: trips, label: 'Путешествия', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: insurance, label: 'Страхование', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: aparts, label: 'Квартиры', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: telecom, label: 'Телеком', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: med, label: 'Медицина', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: childs, label: 'Детские товары', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: restaurants, label: 'Досуг', handler: () => {}, disabled: false},
  {image: presents, label: 'Подарки', handler: () => {}, disabled: false},
  {image: sellers, label: 'Интернет-магазины', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: banks, label: 'Банковские услуги', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: gos, label: 'Госуслуги', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: jku, label: 'ЖКУ', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: car, label: 'Транспорт', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: fitnes, label: 'Фитнес', handler: () => {}, disabled: !isBlockchainUnion.value},
  {image: spa, label: 'Бьюти&СПА', handler: () => {}, disabled: !isBlockchainUnion.value},
]);

const isShowVoucher = ref(false)
const voucherImg = ref('')
const aspectRatio = ref(1)

watch(isShowVoucher, (value) => {
  if (!value) {
    voucherImg.value = ''
    aspectRatio.value = 1
  }
})
// Необходимо для правильного обновление на breakpoint
watch(() => viewport.isLessThan('sm'), async () => {
  isShowSwiper.value = false
  await nextTick()
  isShowSwiper.value = true
})

function showVoucher(img, size) {

  voucherImg.value = img;
  aspectRatio.value = size
  isShowVoucher.value = true;
}

</script>
<style lang="scss" scoped>
.actions {
  min-width: 100%;

  &__header {
    position: relative;
  }

  &__title {
    margin-top: 61px;
    margin-bottom: 15px;
    font-size: 24px;
    font-weight: 700;
    color: rgba(0, 36, 118, 1);
  }

  &__description {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 36, 118, 1);
    margin-bottom: 15px;
  }

  .actions__item {
    padding: 0;
    margin: 0;
    background-repeat: no-repeat;
    background-size: cover;
    height: max-content;
    width: 100%;
    position: relative;
    display: flex;
    align-items: flex-end;
    text-decoration: none;
    border-radius: 5px;
    text-align: start;
    white-space: normal;
    cursor: pointer;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
      linear-gradient(180deg, rgba(0, 36, 118, 0) 52%, rgba(0, 36, 118, 0.696) 82.5%, rgba(0, 36, 118, 0.8) 100%);

      border-radius: 5px;
    }

    &:before {
      content: '';
      width: 100%;
      height: 0;
      padding-top: calc(122 / 170 * 100%);
    }

    span {
      z-index: 10;
      position: absolute;
      bottom: 14px;
      left: 14px;
      right: 14px;
      font-size: 16px;
      font-weight: 600;
      color: rgba(255, 255, 255, 1);
    }

    &_disabled {
      cursor: none;
      pointer-events: none;
      opacity: 0.3;
    }
  }

  &__wrapper {
    margin-right: -94px;
  }

  &__swiper {
    max-width: 100%;
    padding-right: 20px;
  }

  &__nav {
    position: absolute;
    bottom: 0;
    right: 0;
    display: flex;
    gap: 24px;
    justify-content: space-between;
  }

  &__nav-button {
    margin: 0;
    width: 24px;
    height: 24px;
    padding: 0;
    --color: rgba(0, 98, 255, 1);
    border: 1px solid rgba(0, 98, 255, 1);
    border-radius: 50%;
    cursor: pointer;
  }

  &__scroll-wrapper {
    display: none;
    margin-top: 10px;
    height: 10px;
    padding: 2px;
    border: 1px solid rgba(190, 190, 190, 1);
    border-radius: 5px;

    :deep(.swiper-scrollbar-drag) {
      border: 2px solid transparent;
      background-color: rgba(0, 98, 255, 1);
    }
  }
}

@include el.xl {
  .actions {
    &__title {
      margin-top: 180px;
    }

    &__wrapper {
      margin-right: -60px;
    }
  }
}

@include el.lg {
  .actions {
    &__title {
      margin-top: 60px;
    }
  }
}

@include el.sm {
  .actions {
    &__wrapper {
      margin-left: -20px;
      margin-right: -20px;
    }

    &__swiper {
      padding-right: 20px;
      padding-left: 20px;
    }

    &__nav {
      display: none;
    }

    &__scroll-wrapper {
      display: block;
    }
  }
}
</style>

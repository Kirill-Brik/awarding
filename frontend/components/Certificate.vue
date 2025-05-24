<template>
  <div class="certificate" :class="{'mobile': isMobile}">
    <div class="certificate__scale">
      <div class="certificate__wrapper">
        <div class="certificate__wrapper__border">
          <div class="certificate__wrapper__border__box">
            <div class="certificate__header">
              <h3 class="certificate__title">СВИДЕТЕЛЬСТВО</h3>
              <p class="certificate__subtitle">о вступлении в СОЮЗ №{{ union.id }}</p>
            </div>
            <div class="certificate__content">
              <p class="certificate__confirmation certificate__confirmation_top">Настоящим свидетельствуем, что</p>
              <div class="certificate__users">

                <div class="certificate__user">
                  <ElAvatar class="certificate__user-avatar" :size="150"
                            :src="avatarUrl(union.initiator)"/>
                  <p class="certificate__user-name">{{ initiatorFullName }}</p>
                  <p class="certificate__user-dob">{{formatDate(union.initiator.date_of_birth) }}</p>
                </div>
                <div class="certificate__user">
                  <ElAvatar class="certificate__user-avatar" :size="150"
                            :src="avatarUrl(union.union_user)"/>
                  <p class="certificate__user-name">{{ unionUserFullName }}</p>
                  <p class="certificate__user-dob">{{formatDate(union.union_user.date_of_birth) }}</p>
                </div>
              </div>

              <p class="certificate__confirmation certificate__confirmation_bottom">
                вступили в СОЮЗ с помощью платформы VTB.family.
              </p>
              <div v-if="union.transaction_hash" class="certificate__blockchain-info">
                <p class="certificate__blockchain-title">Запись в Блокчейне:</p>
                <p v-if="union.contract" class="certificate__blockchain-item">
                  <span class="certificate__data-label">TxID</span>
                  <span class="certificate__data-value">{{ truncatedText(union.contract) }}</span>
                  <img alt="Copy" class="copy-icon" src="../assets/images/copy.svg"
                       @click="copyToClipboard(union.contract)">
                </p>
                <p v-if="union.transaction_hash" class="certificate__blockchain-item">
                  <span class="certificate__data-label">Адрес</span>
                  <span class="certificate__data-value">{{ truncatedText(union.transaction_hash) }}</span>
                  <img alt="Copy" class="copy-icon" src="../assets/images/copy.svg"
                       @click="copyToClipboard(union.transaction_hash)">
                </p>
                <p v-if="union.confirm_date" class="certificate__blockchain-item">
                  <span class="certificate__data-label">Дата</span>
                  <span class="certificate__data-value">{{ formatDate(union.confirm_date) }}</span>
                </p>
              </div>
            </div>
            <div class="certificate__footer">
              <div class="certificate__footer__box">
                <img class="certificate__footer-logo" alt="2024" src="../assets/images/2024.svg" style="width: 42px"/>
                <p class="certificate__footer-text">В рамках национального проекта «Семья»</p>
              </div>
              <img class="certificate__footer-seal" alt="seal" src="../assets/images/seal.svg"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import defaultAvatar from "assets/images/avatar.svg";
import moment from "moment/moment.js";

const config = useRuntimeConfig();
const viewport = useViewport()
const props = defineProps({
  union: Object,
  scaleTarget: Object,
  isMobile: {
    type: Boolean,
    default: false,
  }
});
const scale = ref(1);
const observer = new ResizeObserver(entries => {
  const width = entries[0].contentRect.width;
  if (!props.isMobile || viewport.isGreaterOrEquals('sm')) {
    if (width < 595) scale.value = width / 595;
    else scale.value = 1;
  } else {
    scale.value = width / 320;
  }
});

const formatDate = (date) => {
  return moment(date).format('DD.MM.YYYY')
}

function truncatedText(text) {
  return text && text.length > 25 ? `${text.slice(0, 15)}...` : text;
}

const avatarUrl = (user) => {
  if (user && user.avatar && user.avatar.formats)
    if (user.avatar.formats.medium) return config.public.serverBase + user.avatar.formats.medium.url
    else return config.public.serverBase + user.avatar.url
  else return defaultAvatar
};

const initiatorFullName = computed(() => {
  return `${props.union.initiator.first_name} ${props.union.initiator.middle_name} ${props.union.initiator.surname}`;
});

const unionUserFullName = computed(() => {
  return `${props.union.union_user.first_name} ${props.union.union_user.middle_name} ${props.union.union_user.surname}`;
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Текст скопирован в буфер обмена');
  });
}

onMounted(() => {
  observer.observe(props.scaleTarget);
});
onUnmounted(() => {
  observer.unobserve(props.scaleTarget);
});
</script>

<style lang="scss" scoped>
.certificate {
  position: relative;
  width: 100%;
  max-width: 595px;
  height: 0;
  padding-top: calc(842 / 595 * 100%);

  &__scale {
    position: absolute;
    top: 0;
    left: 0;
    width: 595px;
    transform: scale(v-bind(scale));
    transform-origin: top left;
    overflow: hidden;

    &:before {
      content: '';
      display: block;
      width: 100%;
      padding-top: calc(842 / 595 * 100%);
      height: 0;
    }
  }

  &__wrapper {
    position: absolute;
    inset: 0;
    overflow: hidden;
    background-image: url('../assets/images/certificate/background.svg');
    background-size: cover;
    padding: 24px;
    color: rgba(255, 255, 255, 1);

    &__border {
      border: 3px solid #fff;
      height: 100%;
      padding: 4px;

      &__box {
        border: 1px solid #fff;
        height: 100%;
        padding: 50px 50px 10px;
        flex-direction: column;
        justify-content: space-between;
        display: flex;
      }
    }
  }

  &__header {
    text-align: center;
  }

  &__title {
    font-weight: 700;
    font-size: 30px;
  }

  &__subtitle {
    font-weight: 400;
    font-size: 14px;
    padding-top: 5px;
  }

  &__content {
    flex: 1 1 auto;
    text-align: center;
    z-index: 2;
    position: relative;
  }

  &__users {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  &__user {
    text-align: center;
  }

  &__user-name {
    word-break: break-word;
    margin-top: 10px;
    font-weight: 600;
    font-size: 14px;
  }

  &__user-dob {
    font-size: 12px;
    font-weight: 400;
    margin-bottom: 34px;
    margin-top: 4px;
  }

  &__confirmation {
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 40px;

  }

  &__blockchain-info {
    padding-left: 50px;
    padding-right: 50px;
    text-align: left;
  }

  &__blockchain-title {
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  &__blockchain-item {
    position: relative;
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 5px;
  }

  &__data-label {
    width: 60px;
  }

  &__data-value {
    position: relative;
    flex: 0 1 auto;
  }

  .copy-icon {
    //position: absolute;
    //left: 40%;
    cursor: pointer;
  }

  &__footer {
    font-weight: 500;
    text-align: center;
    font-size: 14px;
    display: flex;

    &__box {
      display: flex;
      align-items: center;
    }
  }
}

@include el.sm {
  .mobile.certificate {
    padding-top: calc(626 / 320 * 100%);

    .certificate {
      &__scale {
        width: 320px;

        &:before {
          padding-top: calc(626 / 320 * 100%);
        }
      }

      &__wrapper {
        padding: 8px 9px;

        &__border {
          border-width: 2px;

          &__box {
            padding: 46px 17px 0;
          }
        }
      }

      &__content {
        flex: 1 0 auto;
        display: flex;
        flex-direction: column;
      }

      &__title {
        font-size: 24px;
        line-height: 17px;
      }

      &__user-avatar {
        --el-avatar-size: 90px !important;
      }

      &__user-name {
        font-size: 10px;
        line-height: 12px;
      }

      &__user-dob {
        margin-bottom: 0;
      }

      &__confirmation {
        font-size: 14px;
        line-height: 20px;

        &_top {
          margin-top: 46px;
          margin-bottom: 20px;
        }

        &_bottom {
          flex: 1 1 auto;
          margin-bottom: 15px;
        }
      }

      &__blockchain-title {
        font-size: 12px;
      }

      &__blockchain-item {
        font-size: 12px;
      }

      &__blockchain-info {
        padding: 0;
      }

      .copy-icon {
        width: 12px;
        height: 12px;
      }

      &__footer {
        margin: 0 -17px;
      }

      &__footer-logo {
        margin-left: 8px;
        width: 37px !important;
      }

      &__footer-text {
        margin-left: 5px;
        font-size: 10px;
        line-height: 12px;
        text-align: start;
      }

      &__footer-seal {
        width: 110px;
      }
    }
  }
}
</style>

<template>
  <div class="union">
    <div class="union__info">
      <div>
        <template v-if="union.status === 'disable'">
          <div class="union__info__container">
            <h3 class="union__info__container__right__title">
              Ваше свидетельство №{{ union.id }} cформировано.
            </h3>
            <div style="display: flex;">
              <div class="union__info__container__image">
                <img alt="" src="../assets/images/disable-image.png"
                     style="width: 100%; height: 100%; object-fit: cover"/>
              </div>
              <div class="union__info__container__right">
                <p v-if="union.initiator.id === userStore.user.id" class="union__info__container__right__text">
                  Ожидаем подтверждение принятия союза. Получателю отправлено приглашение на указанный e-mail
                  {{ union.guest_data.email }}.
                </p>
                <p v-else-if="union.guest_data.email === userStore.user.email"
                   class="union__info__container__right__text">
                  Вам пришло приглашение на вступление в СОЮЗ от
                  {{ inclineUser(union.initiator, 'genitive') }}.
                  Ожидаем вашего подтверждения.
                </p>
                <UnionInfoContent :union="union"/>
                <span class="union__status union__status_disable">Неактивно</span>
              </div>
            </div>

          </div>
        </template>
        <template v-else-if="union.status === 'confirm'">
          <div class="union__info__container">
            <h3 v-if="union.transaction_hash" class="union__info__container__right__title">
              Поздравляем ваш СОЮЗ!
            </h3>
            <h3 v-else class="union__info__container__right__title">
              Ваше свидетельство №{{ union.id }} готово для регистрации в Блокчейн.
            </h3>
            <div style="display: flex;">
              <div ref="certificateWrapper" class="union__info__container__image" @click="openCertificateModal(union)">
                <Certificate v-if="certificateWrapper" :scale-target="certificateWrapper"
                             :union="union" class="union__certificate"/>
                <img v-else alt="" src="../assets/images/disable-image.png"
                     style="width: 100%; height: 100%; object-fit: cover"/>
              </div>
              <div class="union__info__container__right">

                <p v-if="union.transaction_hash" class="union__info__container__right__text">
                  Свидетельство №{{ union.id }} зарегистрировано в Блокчейн. Желаем такого же крепкого и неразрывного
                  СОЮЗа, как сеть Блокчейн!
                </p>
                <p v-else-if="union.initiator.id === userStore.user.id" class="union__info__container__right__text">
                  {{ inclineUser(union.union_user, 'nominative') }}
                  {{ union.union_user.gender === 'male' ? 'принял' : 'приняла' }}
                  приглашение о вступлении в СОЮЗ. Свидетельство доступно к регистрации в Блокчейн.
                </p>
                <p v-else-if="union.guest_data.email === userStore.user.email"
                   class="union__info__container__right__text">
                  Приглашение о вступлении в СОЮЗ от {{ inclineUser(union.initiator, 'genitive') }} принято.
                  Свидетельство доступно к регистрации в Блокчейн.
                </p>
                <UnionInfoContent :union="union"/>
                <span v-if="union.transaction_hash"
                      class="union__status union__status_active">Подписано в Блокчейн</span>
                <span v-else class="union__status union__status_confirm">Приглашение принято</span>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="union.status === 'not_confirm'">
          <div class="union__info__container">
            <h3 v-if="union.initiator.id === userStore.user.id" class="union__info__container__right__title">
              Получатель отказался от приглашения вступить в СОЮЗ.
            </h3>
            <h3 v-else-if="union.guest_data.email === userStore.user.email"
                class="union__info__container__right__title">
              Вы отказались от приглашения вступить в СОЮЗ.
            </h3>
            <div style="display: flex;">
              <div class="union__info__container__image">
                <img alt="" src="../assets/images/not-confirm-image.svg"
                     style="width: 100%; height: 100%; object-fit: cover"/>
              </div>
              <div class="union__info__container__right">

                <p v-if="union.initiator.id === userStore.user.id" class="union__info__container__right__text">
                  {{ inclineUser(union.union_user, 'nominative') }}
                  {{ union.union_user.gender === 'male' ? 'отклонил' : 'отклонила' }} ваше предложение.
                </p>
                <p v-else-if="union.guest_data.email === userStore.user.email"
                   class="union__info__container__right__text">
                  Приглашение от {{ inclineUser(union.initiator, 'genitive') }} отклонено.
                </p>
                <UnionInfoContent :union="union"/>
                <span class="union__status union__status_not-confirm">Отказано</span>
              </div>
            </div>

          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import UnionInfoContent from '@/components/UnionInfoContent.vue';
import {incline} from 'lvovich';

const props = defineProps({
  union: {
    type: Object,
    required: true,
  },
});
const certificateWrapper = ref()
const unionsStore = useUnionsStore();
const modalStore = useModalStore();
const userStore = useUserStore()

function inclineUser({first_name, middle_name, surname, gender}, declension) {
  const inclineUser = incline({first: first_name, middle: middle_name, last: surname, gender}, declension);
  return `${inclineUser.last} ${inclineUser.first}${inclineUser.middle ? " " + inclineUser.middle : ''}`
}

const openCertificateModal = (union) => {
  unionsStore.active = union
  modalStore.openModal('certificateModal');
};

const certificateImage = computed(() => {
  if (props.union.status === "disable") {
    return "../assets/images/not-confirm-image.svg";
  } else if (props.union.status === "confirm") {
    return "../assets/images/confirm-image.svg";
  } else {
    return "../assets/images/not-confirm-image.png";
  }
});
</script>


<style lang="scss">
.copy-icon {
  margin-left: 10px;
  cursor: pointer;
}

.union {
  display: flex;

  background-color: white;
  border-radius: 10px;

  &__certificate {
    cursor: pointer;
  }

  &__info {
    padding: 18px 19px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    color: black;

    &__container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      &__image {
        flex: 0 0 auto;
        width: 143px;
        margin-right: 20px;
        border-radius: 7px;
        overflow: hidden;
        background-repeat: no-repeat;
        background-size: cover;
      }

      &__right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &__title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 22px;
          word-break: break-word;
        }

        &__text {
          font-weight: 500;
          font-size: 14px;
          line-height: 17px;
          margin-bottom: 24px;
          word-break: break-word;
        }

        &__content {
          flex: 1 0 auto;
          list-style: none;
          padding: 0;
          margin-bottom: 20px;
          font-size: 12px;


          &__item {
            display: flex;
            align-items: baseline;
            padding: 5px 0;

            &:first-of-type {
              padding-top: 0;
            }

            &:last-of-type {
              padding-bottom: 0;
            }

            &__label {
              font-weight: 500;
              color: rgba(186, 186, 186, 1);
              font-size: 12px;
              min-width: 44px;
              max-width: 105px;
              display: inline-block;
              margin-right: 5px
            }

            &__value {
              font-weight: 500;
              color: rgba(0, 18, 33, 1);
              font-size: 12px;
              text-align: right;
            }
          }


        }
      }
    }
  }

  &__status {
    padding: 7px 25px;
    min-width: 137px;
    width: max-content;
    text-align: center;
    border-radius: 32px;
    font-size: 14px;
    line-height: 10px;
    font-weight: 600;

    &_disable {
      border: 1px solid rgba(185, 185, 185, 1);
      color: rgba(185, 185, 185, 1);
    }

    &_not-confirm {
      border: 1px solid rgba(225, 67, 67, 1);
      color: rgba(225, 67, 67, 1);
    }

    &_confirm {
      border: 1px solid rgba(0, 98, 255, 1);
      color: rgba(0, 98, 255, 1);
    }

    &_active {
      border: 1px solid rgba(138, 196, 75, 1);
      color: rgba(138, 196, 75, 1);
    }
  }
}

@include el.sm {
  .union {
    &__info {
      padding: 16px 15px;

      &__container {
        &__image {
          margin-right: 12px;
          width: 109px;
        }

        &__right {
          &__title {
            margin-bottom: 20px;
            font-size: 16px;

          }

          &__text {
            font-size: 12px;
            line-height: 16px;
            margin-bottom: 3px;

          }

          &__content {
            display: flex;
            flex-direction: column;
            gap: 0px;
            margin-bottom: 4px;

            &__item {
              padding: 0;

              &__label {
                font-size: 10px;
                line-height: 11px;
              }
            }
          }
        }
      }
    }

    &__status {
      padding: 4px 14px;
      font-size: 11px;
    }
  }
}
</style>

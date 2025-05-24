<template>
  <div class="reset-password">
    <div class="reset-password__container">
      <header class="reset-password__container__header">
        <img alt="ВТБ Логотип" class="reset-password__container__header__logo" src="../assets/images/new_logo.svg"/>
      </header>
      <div class="reset-password__container__content">
        <div class="reset-password__container__content__description">
          <h1 class="reset-password__container__content__description__header">Восстановление пароля</h1>
          <ElForm ref="formRef" :model="form" :rules="formRules" class="reset-password__container__content__form"
                  hide-required-asterisk label-position="top" @submit="resetPassword" @keyup.enter="handleEnterKey">
            <div style="width: 100%">
              <BaseInput v-model="form.password" class="reset-password__form-item" :error="apiErrors.password"
                         height="60px" margin-bottom="2px" name="password" placeholder="Новый пароль" type="password"
                         width-large="370px" width-small="100%" @update:model-value="clearError('password')"/>
              <BaseInput v-model="form.passwordConfirmation" class="reset-password__form-item"
                         :error="apiErrors.passwordConfirmation" height="60px" margin-bottom="2px"
                         name="confirmPassword" placeholder="Подтверждение пароля" type="password" width-large="370px"
                         width-small="100%" @update:model-value="clearError('passwordConfirmation')"/>
              <ul v-if="Object.keys(apiErrors).length" class="reset-password__error-list">
                <li v-for="(error, field) in apiErrors" class="reset-password__error">
                  <ElIcon :size="8">
                    <IconsInfo/>
                  </ElIcon>
                  {{ error }}
                </li>
              </ul>
            </div>
            <div class="reset-password__container__content__btn">
              <BaseButton border-radius="5px" width-large="370px" width-small="100%" @click="resetPassword"
                          :disabled="Object.keys(apiErrors).length > 0">
                Далее
              </BaseButton>
              <NuxtLink class="reset-password__container__content__btn__link" width="370px" to="/">
                Отменить
              </NuxtLink>
            </div>
          </ElForm>
        </div>
      </div>
      <div class="reset-password__container__footer">
        <img alt="2024" src="../assets/images/2024.svg"/>
        <p class="reset-password__container__footer__description">
          В рамках национального проекта «Семья»
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue';
import BaseButton from "~/components/base/BaseButton.vue";
import BaseInput from "~/components/base/BaseInput.vue";

const userStore = useUserStore();
const appStore = useAppStore();
const route = useRoute();
const form = ref({
  password: '',
  passwordConfirmation: '',
  code: route.query.code || ''
});
const formRef = ref();
const formRules = ref({
  email: [{required: true, trigger: 'change', message: ''}],
});
const apiErrors = ref({});

const resetPassword = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      appStore.load(true);
      await userStore.resetPassword(form.value)
          .then(async () => {
            await navigateTo('/')
          })
          .catch((res) => {
            console.log(res);
            if (res.data.error) apiErrors.value = parseApiError(res.data.error)
          })
          .finally(() => appStore.load(false));
    } else {
      console.log('error submit!', fields);
      errorMessage.value = 'Заполните поля и повторите попытку';
    }
  });
};

function clearError(key) {
  if (apiErrors.value.main) delete apiErrors.value.main
  if (apiErrors.value[key]) delete apiErrors.value[key]
}

const handleEnterKey = async () => {
  await resetPassword();
};
</script>

<style lang="scss" scoped>
.reset-password {
  overflow: hidden;
  background: rgba(0, 13, 42, 1) url('../assets/images/big-main.svg') no-repeat center center;
  background-size: cover;
  height: 100vh;

  &__form-item {
    position: relative;
    width: 100%;
    margin-bottom: 15px;

    &:deep(.el-input__wrapper) {
      background-color: transparent;

      &.is-focus {
        box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
      }
    }

    &:deep(.el-input__inner) {
      color: rgba(255, 255, 255, 1);

      &::placeholder {
        color: rgba(255, 255, 255, 1);
      }
    }

    &:deep(.el-form-item__label) {
      margin-bottom: 0 !important;
    }
  }

  &__error-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
    --color: rgba(0, 18, 33, 1);
    color: rgba(225, 67, 67, 1);
    font-size: 12px;
    line-height: 14px;
    font-weight: 500;

    &:deep(.el-icon) {
      margin-right: 2px;
      width: 14px;
      height: 14px;
      background-color: rgba(225, 67, 67, 1);
      border-radius: 50%;
    }
  }

  &__error {
    display: flex;
    gap: 8px;

    :deep(.el-icon) {
      flex: 0 0 auto;
    }
  }

  &__container {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: 42px 42px 42px 150px;
    justify-content: space-between;
    @include el.md {
      padding: 24px 20px;
      height: 100%;
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      &__logo {
        width: 221px;
        @include el.md {
          width: 100px;
        }
      }

      &__buttons {
        display: flex;
        gap: 10px;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &__description {
        margin-bottom: 20px;

        &__header {
          font-size: 24px;
          color: rgba(255, 255, 255, 1);
          font-weight: 700;

          margin-top: 0;
          margin-bottom: 30px;

          @include el.md {
            //font-size: 10px;
            margin-top: 14px;
            margin-bottom: 10px;
          }
        }

        &__title {
          margin-bottom: 30px;
          font-size: 44px;
          color: rgba(255, 255, 255, 1);
          font-weight: 700;
          line-height: 52px;

          max-width: 600px;
          margin-bottom: 64px;
          @include el.md {
            font-size: 24px;
            line-height: 28px;
            margin-bottom: 32px;
            max-width: 310px;
          }
        }

        &__text {
          margin-bottom: 30px;
          display: block;
          max-width: 348px;
          font-size: 16px;
          line-height: 24px;
          font-weight: 600;
          color: rgba(0, 98, 255, 1);
        }
      }

      &__form {
        max-width: 370px;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 30px;

        @include el.md {
          max-width: 100%;
        }
      }

      &__link {
        display: flex;
        justify-content: space-between;
        width: 380px;
        @include el.md {

        }

        &__register {
          color: rgba(0, 98, 255, 1);
          text-decoration: underline;
          cursor: pointer;
          margin-left: 10px;
        }

        &__password {
          color: rgba(0, 98, 255, 1);
          text-decoration: underline;
          cursor: pointer;
          margin-bottom: 30px;
          margin-top: 5px;
          font-weight: 600;
          font-size: 16px;

          @include el.md {
            font-size: 14px;
          }
        }
      }

      &__btn {
        display: flex;
        flex-direction: column;
        gap: 20px;
        align-items: center;
        max-width: 370px;
        @include el.md {
          gap: 10px;
          max-width: 100%;
          width: 100%;
        }

        &__link {
          color: rgba(0, 98, 255, 1);
          text-decoration: underline;
          cursor: pointer;
          margin-bottom: 30px;
          font-weight: 600;
          font-size: 16px;
          @include el.md {
            font-size: 14px;
          }
        }
      }


    }

    &__footer {
      display: flex;
      gap: 20px;
      align-items: center;

      img {
        @include el.md {
          width: 63px;
          height: 47px;
        }
      }

      &__description {
        width: 255px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);

        @include el.md {
          font-size: 16px;
          width: 100%;
        }
      }
    }

  }

}

</style>

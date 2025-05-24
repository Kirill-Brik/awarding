<template>
  <div class="home">
    <div class="home__container">
      <header class="home__container__header">
        <img alt="ВТБ Логотип" class="home__container__header__logo" src="../assets/images/new_logo.svg"/>
      </header>
      <div class="home__container__content">
        <div class="home__container__content__description">
          <h2 class="home__container__content__description__header">НОВЫЙ ВЗГЛЯД НА ОТНОШЕНИЯ</h2>
          <h1 class="home__container__content__description__title">СОЮЗ между<span style="color: rgba(0, 159, 223, 1)"> Мужчиной</span>
            и <span
                style="color:rgba(255, 67, 135, 1);">Женщиной</span></h1>

          <ElForm ref="formRef" :model="form" :rules="formRules" class="home__container__content__form"
                  hide-required-asterisk label-position="top" @submit="login" @keyup.enter="handleEnterKey">
            <BaseInput v-model="form.email" class="home__form-item" :error="apiErrors.identifier" height="60px"
                       margin-bottom="2px" name="email"
                       placeholder="E-mail" type="email" width-large="370px" width-small="100%"
                       @update:model-value="clearError('identifier')"/>
            <BaseInput v-model="form.password" class="home__form-item" :error="apiErrors.password" height="60px"
                       margin-bottom="2px"
                       name="password" placeholder="Пароль" type="password"
                       width-large="370px" width-small="100%"
                       @update:model-value="clearError('password')"/>
            <ul v-if="Object.keys(apiErrors).length" class="home__error-list">
              <li v-for="(error, field) in apiErrors" class="home__error">
                <ElIcon :size="8">
                  <IconsInfo/>
                </ElIcon>
                {{ error }}
              </li>
            </ul>
            <div class="home__container__content__link">
              <NuxtLink class="home__container__content__link__password" to="forgot-password">Забыли пароль?</NuxtLink>
            </div>
            <div class="home__container__content__btn">
              <BaseButton border-radius="5px" width-large="370px" width-small="100%" @click="login"
                          :disabled="Object.keys(apiErrors).length > 0">
                Войти
              </BaseButton>
              <NuxtLink class="home__container__content__btn__link" width="370px" @click="goToRegister">
                Зарегистрироваться
              </NuxtLink>
            </div>
          </ElForm>
        </div>
      </div>
      <div class="home__container__footer">
        <img alt="2024" src="../assets/images/2024.svg"/>
        <p class="home__container__footer__description">
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

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();
const form = ref({
  email: route.query.email || '',
  password: '',
});
const formRef = ref();
const formRules = ref({
  email: [{required: true, trigger: 'change', message: ''}],
  password: [{required: true, trigger: 'change', message: ''}]
});
const errorMessage = ref('');
const apiErrors = ref({});

const login = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      appStore.load(true);
      const init_invite = route.query.invite || null;
      await userStore.login(form.value.email, form.value.password, init_invite)
          .then(async () => await navigateTo('/profile'))
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
  await login();
};

const goToRegister = async () => {
  await navigateTo('/register');
};
</script>

<style lang="scss" scoped>
.home {
  overflow: hidden;
  background: rgba(0, 13, 42, 1) url('../assets/images/big-main.svg') no-repeat center center;
  background-size: cover;
  min-height: 100vh;

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
  }

  &__error {
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

  &__container {
    display: flex;
    flex-direction: column;
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
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
          font-weight: 700;

          margin-top: 30px;
          margin-bottom: 30px;

          @include el.md {
            font-size: 10px;
            margin-top: 14px;
            margin-bottom: 10px;
          }
        }

        &__title {
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

      }

      &__form {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        max-width: 370px;

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

<template>

  <div class="register">
    <div class="register__mobile">

      <img alt="logo" src="../assets/images/new_logo.svg"/>
    </div>
    <div class="register__container">

      <div class="register__container__left">
        <NuxtLink class="register__container__left-header" href="/">
          <img alt="arrow-left" src="../assets/images/arrow-left.svg"/>
          <span class="register__header__back">Главная</span>
        </NuxtLink>
        <h1 class="register__container__left-title">Регистрация</h1>

        <div class="register__container__left-photo">
          <ElUpload :http-request="(option) => {option.onSuccess()}" :before-upload="beforeAvatarUpload"
                    :on-success="handleAvatarSuccess" :show-file-list="false" class="register__upload"
                    style="width: 100%;height: 100%">
            <ElAvatar v-if="avatar" :size="120" :src="avatarUrl"/>
            <ElAvatar v-else :size="120" :src="defaultAvatar"/>
          </ElUpload>
          <ElIcon :size="20">
            <IconsUpload/>
          </ElIcon>
        </div>
        <BaseInput v-model="surname" :error="apiErrors.surname" height="60px" margin-bottom="2px" name="surname"
                   placeholder="Фамилия" width-large="370px" width-small="100%"
                   @update:model-value="clearError('surname')"/>
        <BaseInput v-model="firstName" :error="apiErrors['first_name']" height="60px" margin-bottom="2px"
                   name="firstName"
                   placeholder="Имя" width-large="370px" width-small="100%"
                   @update:model-value="clearError('first_name')"/>
        <BaseInput v-model="middleName" :error="apiErrors['middle_name']" height="60px" margin-bottom="2px"
                   name="middleName" placeholder="Отчество (при наличии)" width-large="370px"
                   width-small="100%" @update:model-value="clearError('middle_name')"/>
        <BaseInput v-model="email" :error="apiErrors.email" height="60px" margin-bottom="2px" name="email"
                   placeholder="E-mail" width-large="370px" width-small="100%"
                   @update:model-value="clearError('email')"/>
        <BaseInput v-model="phone" v-bind="phoneMask" :error="apiErrors.phone" height="60px" margin-bottom="2px"
                   name="phone"
                   placeholder="Телефон" width-large="370px" width-small="100%"
                   @update:model-value="clearError('phone')"/>
        <BaseInput v-model="gender" :error="apiErrors.gender" :options="genderOptions" height="60px" margin-bottom="2px"
                   name="gender" placeholder="Пол" type="select" width-large="370px" width-small="100%"
                   @update:model-value="clearError('gender')"/>
        <BaseInput v-model="dob" :error="apiErrors['date_of_birth']" height="60px" margin-bottom="2px" name="dob"
                   placeholder="Дата рождения" type="date" width-large="370px" width-small="100%"
                   @update:model-value="clearError('date_of_birth')"/>
        <BaseInput v-model="password" :error="apiErrors.password" height="60px" margin-bottom="2px" name="password"
                   placeholder="Пароль" type="password" width-large="370px" width-small="100%"
                   @update:model-value="clearError('password')"/>
        <BaseInput v-model="confirmPassword" :error="apiErrors.password" height="60px" margin-bottom="2px"
                   name="confirmPassword" placeholder="Подтвердите пароль" type="password"
                   width-large="370px" width-small="100%"
                   @update:model-value="clearError('password')"/>

        <ul v-if="Object.keys(apiErrors).length" class="register__error-list">
          <li v-for="(error, field) in apiErrors" :key="field" class="register__error">
            <ElIcon :size="8" class="register__error-icon">
              <IconsInfo/>
            </ElIcon>
            {{ error }}
          </li>
        </ul>

        <div class="register__container__left__agreement">
          <div class="register__container__left__agreement__checkbox">
            <div class="register__container__left__agreement-checkbox__box">
              <BaseInput v-model="agreement" is-checkbox margin-bottom="0px" type="checkbox"/>
              <p>
                Согласен с условиями
                <a href="/file/TermsOfUse.pdf" target="_blank">
                  пользовательского соглашения и оферты
                </a>
              </p>
            </div>
            <div class="register__container__left__agreement-checkbox__box">
              <BaseInput v-model="dataProcessing" is-checkbox margin-bottom="0px" type="checkbox"/>
              <p>Согласен на
                <a href="/file/PersonalInformation.pdf" target="_blank">
                  обработку персональных данных
                </a>
              </p>
            </div>
            <div class="register__container__left__agreement-checkbox__box">
              <BaseInput v-model="notifications" is-checkbox margin-bottom="0px" type="checkbox"/>
              <p> Согласен на
                <a href="/file/Newsletter.pdf" target="_blank">
                  рассылку уведомлений
                </a>
              </p>
            </div>
          </div>
          <BaseButton :disabled="!isFormValid" border-radius="5px" width-large="370px"
                      width-small="100%" @click="register">Зарегистрироваться
          </BaseButton>
        </div>
      </div>

      <div class="register__container__right">
        <img alt="area" class="register__container__right-background" src="../assets/images/personal-area.jpg"/>
        <img alt="area" class="register__container__right-logo" src="../assets/images/new_logo.svg"/>
      </div>

    </div>
  </div>

</template>

<script setup>
import defaultAvatar from '@/assets/images/default_avatar.png';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import {useAppStore} from '@/stores/app';
import {useUserStore} from '@/stores/user';
import {ElMessage} from 'element-plus';
import {computed, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';

const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
const appStore = useAppStore();
const phoneMask = usePhoneMask()

const avatar = ref();
const avatarUrl = computed(() => avatar.value ? URL.createObjectURL(avatar.value) : defaultAvatar);
const surname = ref(decodeURIComponent(route.query.surname || ''));
const firstName = ref(decodeURIComponent(route.query.first_name || ''));
const middleName = ref(decodeURIComponent(route.query.middle_name || ''));
const email = ref(route.query.email);
const phone = ref('');
const gender = ref(route.query.gender);
const dob = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreement = ref(false);
const dataProcessing = ref(false);
const notifications = ref(false);
const apiErrors = ref({});

function clearError(key) {
  if (apiErrors.value.main) delete apiErrors.value.main
  if (apiErrors.value[key]) delete apiErrors.value[key]
}

const genderOptions = [
  {value: 'male', label: 'Мужчина'},
  {value: 'female', label: 'Женщина'},
];

const handleAvatarSuccess = (response, uploadFile) => {
  avatar.value = uploadFile.raw;
};

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Изображение аватара должно быть в формате JPG или PNG!');
    return false;
  }
  return true;
};

const isFormValid = computed(() => {
  return (
      surname.value &&
      firstName.value &&
      email.value &&
      phone.value &&
      gender.value &&
      dob.value &&
      password.value &&
      confirmPassword.value &&
      agreement.value &&
      dataProcessing.value &&
      notifications.value &&
      Object.keys(apiErrors.value).length === 0
  );
});

const register = async () => {

  const data = {
    avatar: avatar.value,
    email: email.value,
    password: password.value,
    phone: phone.value,
    gender: gender.value,
    date_of_birth: dob.value,
    surname: surname.value,
    first_name: firstName.value,
    middle_name: middleName.value,
  };

  appStore.load(true);
  try {
    await userStore.register(data, route.query.invite || null);
    await router.replace('/profile');
  } catch (res) {
    console.error(res);
    if (res.data.error) apiErrors.value = parseApiError(res.data.error)
  } finally {
    appStore.load(false);
  }
};
</script>


<style lang="scss" scoped>


.register {
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: rgba(0, 13, 42, 1);
  align-items: center;
  @include el.md {
    background-image: url('../assets/images/personal-area.jpg');
    background-size: cover;
    background-position: center;
  }

  &__mobile {
    display: none;
    width: 100%;
    margin-bottom: 20px;

    img {
      width: 133px;
      height: 60px;
    }

    @include el.md {
      display: flex;
    }
  }

  &__container {
    display: flex;
    width: 100%;
    max-width: 1260px;
    border-radius: 30px;
    background-color: rgb(255, 255, 255);
    overflow: hidden;
    //max-width: 1200px;
    //@include el.md {
    //  width: 100%;
    //}
    &__left {
      height: 100%;
      width: 40%;
      min-width: 450px;
      padding: 50px 70px;
      @include el.md {
        width: 100%;
        min-width: auto;
        padding: 20px;
      }

      &-header {
        display: flex;
        align-items: center;
        color: rgba(0, 98, 255, 1);
        gap: 10px;
        width: 88px;
        cursor: pointer;

        font-size: 16px;
        font-weight: 500;

        &:hover {
          color: rgba(0, 36, 118, 1)
        }


      }

      &-title {
        font-size: 40px;
        font-weight: 700;
        color: rgba(0, 36, 118, 1);
        margin-bottom: 50px;
        margin-top: 35px;

        @include el.md {
          font-size: 24px;
          margin-bottom: 34px;
          margin-top: 24px;
        }
      }

      &-photo {
        position: relative;
        margin-bottom: 25px;
        width: max-content;

        &:deep(.el-icon) {
          pointer-events: none;
          position: absolute;
          bottom: 7px;
          right: 8px;
          padding: 4px;
          border-radius: 50%;
          background-color: white;
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
          --color: rgba(190, 190, 190, 1);
        }
      }

      &__agreement {

        button {
          margin-top: 20px;
        }

        &-checkbox {

          &__box {
            display: flex;
            align-items: baseline;
            gap: 10px;


            p {
              font-size: 14px;
              font-weight: 500;
              color: rgba(51, 51, 51, 1);

              a {
                color: rgba(0, 98, 255, 1);
              }
            }

          }
        }
      }
    }

    &__right {
      width: 60%;
      position: relative;

      @include el.md {
        display: none;
      }

      &-background {
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 0 30px 30px 0;
        width: 100%;
        min-height: 100%;
        object-fit: cover;
      }

      &-logo {
        width: 221px;
        position: absolute;
        right: 10%;
        top: 4%;
      }
    }

  }

  &__error-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: rgba(225, 67, 67, 1);
    margin-top: 20px;
    margin-bottom: 20px;
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  &__error-icon {
    flex: 0 0 auto;
    --color: white;
    background-color: rgba(225, 67, 67, 1);
    border-radius: 50%;
    width: 14px;
    height: 14px;
  }
}
</style>

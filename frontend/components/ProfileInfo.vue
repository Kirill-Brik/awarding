<template>
  <div class="profile">
    <div style="display: flex; align-items: flex-end; justify-content: space-between;">
      <h1 class="profile__title">Личный кабинет</h1>
    </div>

    <div class="profile__content">
      <div class="profile__avatar-container">
        <img
            :src="avatarUrl"
            alt="Фото профиля"
            class="profile__avatar"/>
        <img alt="Редактировать фото" class="profile__edit-avatar" src="../assets/images/edit-icon.svg"
             @click="openEditModal"/>

      </div>
      <h2 class="profile__name">
        {{ userState.user.surname }}
        <br v-if="viewport.isLessThan('sm')"/>
        {{ userState.user.first_name }}
        {{ userState.user.middle_name }}
      </h2>
      <div class="profile__info">
        <ul class="profile__info__wrapper">
          <li class="profile__info__wrapper__item">
            <span class="profile__info__wrapper__item-label">Почта</span>
            <span class="profile__info__wrapper__item-value">{{ userState.user.email }}</span>
          </li>
          <li class="profile__info__wrapper__item">
            <span class="profile__info__wrapper__item-label">Номер телефона</span>
            <span class="profile__info__wrapper__item-value">{{ phoneMask.formatter(userState.user.phone) }}</span>
          </li>
          <li class="profile__info__wrapper__item">
            <span class="profile__info__wrapper__item-label">Дата рождения</span>
            <span class="profile__info__wrapper__item-value">{{formatDate(userState.user.date_of_birth) }}</span>
          </li>
          <li class="profile__info__wrapper__item">
            <span class="profile__info__wrapper__item-label">Пол</span>
            <span class="profile__info__wrapper__item-value">
              {{ userState.user.gender === 'male' ? 'Мужской' : 'Женский' }}
            </span>
          </li>
          <li v-if="!userState.user.about" class="profile__info__wrapper__item">
            <span class="profile__info__wrapper__item-label">О себе</span>
            <span class="profile__info__wrapper__item-value"
                  style="color: rgba(186, 186, 186, 1); word-break: break-word;">
              Пользователь ещё не указал информацию о себе
            </span>
          </li>
        </ul>
      </div>
      <p v-if="userState.user.about" class="profile__info-text"
         style=" word-break: break-word;">
        {{ userState.user.about }}
      </p>
    </div>
    <EditProfileModal :user="userState.user"/>

  </div>
</template>

<script setup>
import {computed} from 'vue';
import EditProfileModal from '~/components/EditProfileModal.vue';
import defaultAvatar from '../assets/images/avatar.svg'; // Импортируем дефолтный аватар
import moment from 'moment';

const userState = useUserStore();
const modalStore = useModalStore();
const config = useRuntimeConfig();
const router = useRouter()
const viewport = useViewport()
const phoneMask = usePhoneMask()

const avatarUrl = computed(() => {
  if (userState.user.avatar && userState.user.avatar.formats)
    if (userState.user.avatar.formats.medium) return config.public.serverBase + userState.user.avatar.formats.medium.url
    else return config.public.serverBase + userState.user.avatar.url
  else return defaultAvatar
});
const openEditModal = () => {
  modalStore.openModal('editProfile')
};
const formatDate = (date) => {
  return moment(date).format('DD.MM.YYYY')
}

</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-direction: column;


  &__title {
    font-size: 40px;
    font-weight: 700;
    color: rgba(0, 36, 118, 1);
    padding-top: 50px;
  }

  &__content {
    padding-top: 70px;
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-auto-rows: max-content 1fr;
  }

  &__avatar-container {
    display: flex;
    grid-row: 1 / 3;
    grid-column: 1 / 2;
    position: relative;
    margin-right: 30px;
    height: max-content;
  }

  &__avatar {
    width: 170px;
    height: 170px;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
  }

  &__edit-avatar {
    position: absolute;
    bottom: 0;
    right: 20px;
    border: none;
    cursor: pointer;
  }

  &__name {
    word-break: break-word;
    grid-row: 1 / 2;
    grid-column: 2 / 3;
    font-size: 24px;
    font-weight: bold;
    color: #0a2973;
    margin-bottom: 20px;
  }

  &__info {
    grid-row: 2 / 3;
    grid-column: 2 / 3;
    display: flex;
    flex-direction: column;
    justify-content: start;

    &__wrapper {
      list-style: none;
      padding: 0;
      margin: 0;

      &__item {
        display: flex;
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 500;

        &-label {
          min-width: 116px;
          color: rgba(186, 186, 186, 1);
          margin-right: 10px;
          display: inline-block;
        }

        &-value {
          font-variant-numeric: lining-nums;
          color: rgba(51, 51, 51, 1);
        }

      }


    }
  }

  &__info-text {
    max-width: 470px;
    padding-top: 27px;
    grid-row: 3 / 4;
    grid-column: 1 / 3;
    font-size: 16px;
    line-height: 24px;
    color: rgba(51, 51, 51, 1);
  }

  &__description {
    padding-top: 30px;
    padding-bottom: 20px;
    font-size: 16px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
  }

}

@include el.sm {
  .profile {
    &__title {
      padding-top: 33px;
      font-size: 24px;
      line-height: 17px;
    }

    &__content {
      padding-top: 41px;
    }

    &__avatar-container {
      grid-row: 1 / 2;
      margin-right: 20px;
    }

    &__avatar {
      width: 88px;
      height: 88px;
    }

    &__edit-avatar {
      bottom: 0;
      width: 28px;
      height: 28px;
      right: -2px;
    }

    &__name {
      font-size: 20px;
      line-height: 24px;
    }

    &__info {
      margin-top: 25px;
      grid-row: 3 / 4;
      grid-column: 1 / 3;
    }

    &__info-text {
      padding-top: 25px;
      grid-row: 2 / 3;
    }
  }
}
</style>

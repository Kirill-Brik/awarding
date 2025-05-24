<template>
  <el-dialog v-model="modalStore.confirmInvite" :show-close="false" align-center class="confirm"
             modal-class="confirm__overlay" @closed="unionStore.active = null">
    <div v-if="unionStore.active" class="confirm__wrapper">
      <div v-if="unionStore.active" class="confirm__content">
        <img class="confirm__logo" src="~/assets/images/new_logo.svg"/>
        <h2 class="confirm__title">
          {{ gender === 'male' ? 'Уважаемый' : 'Уважаемая' }}
          {{ userStore.user.surname }}
          {{ userStore.user.first_name }}
          {{ userStore.user.middle_name }}
        </h2>
        <p class="confirm__text">
          {{ unionStore.active.initiator.surname }}
          {{ unionStore.active.initiator.first_name }}
          {{ unionStore.active.initiator.middle_name }}предлагает Вам вступить с ним в СОЮЗ с помощью платформы
          VTB.family. СОЮЗ - объединение Мужчины и Женщины.
          <br>
          <br>
          При вступлении в СОЮЗ предоставляется цифровое Свидетельство с возможностью регистрации в Блокчейне Банка ВТБ.
          <br>
          <br>
          Вступайте в СОЮЗ и пользуйтесь специальными предложениями в разделе «Мир возможностей»!
        </p>
        <div class="confirm__buttons">
          <BaseButton class="confirm__button" @click="submitInvitation(true)">
            Согласиться
          </BaseButton>
          <BaseButton class="confirm__button confirm__button_white" @click="submitInvitation(false)">
            Отказать
          </BaseButton>
        </div>
      </div>
    </div>
  </el-dialog>
  <ErrorGenderUnionModal v-model="isErrorGender"/>
</template>

<script setup>
import {getGender} from "lvovich";

const modalStore = useModalStore();
const unionStore = useUnionsStore();
const userStore = useUserStore()
const route = useRoute()
const isErrorGender = ref(false)
const gender = computed(() => getGender({
  last: userStore.user.surname,
  first: userStore.user.first_name,
  middle: userStore.user.middle_name
}))

watch(() => modalStore.confirmInvite, async (value) => {
  if (value && !unionStore.active)
    await unionStore.getActive(route.params.invite)
})

async function submitInvitation(isConfirm) {
  await unionStore.confirm(unionStore.active.id, isConfirm)
      .then(() => modalStore.closeModals())
      .catch((res) => {
        console.log(res.data.error)
        if (res.data.error.details && res.data.error.details.type === 'forbidden gender') {
          modalStore.closeModals()
          isErrorGender.value = true
        }
      })
}
</script>
<style lang="scss">
.confirm {
  &.el-dialog {
    padding: 0;
    width: calc(100% - 40px);
    max-width: 595px;
    border-radius: 20px;
    overflow: hidden;
  }

  .el-dialog__header {
    display: none;
    padding: 0;
  }
}
</style>


<style lang="scss" scoped>

.confirm {
  &__wrapper {

    background:
        linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 13, 42, 0.8) 90.5%) no-repeat top / 100% 465px,
        url('../assets/images/invitation-mail.svg') no-repeat top / auto 465px,
        rgba(0, 13, 42, 1);
    display: flex;
  }

  &__logo {
    top: 37px;
    left: 42px;
    height: 64px;
    position: absolute;
  }

  &__content {
    padding: 250px 42px 68px;
    border-radius: 10px;
    color: white;
    max-width: 600px;
    width: 100%;
  }

  &__title {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  &__text {
    font-size: 16px;
    line-height: 19px;
    margin-bottom: 70px;
  }

  &__buttons {
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  &__button {
    margin-left: 0;
    height: 45px !important;
    border-radius: 5px !important;
    width: 100% !important;
    max-width: 205px;

    &_white {
      background-color: white !important;
      color: #0062FF !important;
      border: none;
    }
  }
}
</style>

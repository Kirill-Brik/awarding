<template>
  <main v-if="userStore.user" class="user">
    <div class="user__wrapper">
      <header v-if="viewport.isLessThan('sm')" class="user__header">
        <img alt="logo" class="user__logo" src="@/assets/images/new_logo.svg">
      </header>
      <section class="user__main">
        <ProfileInfo/>
        <div class="user__bank">
          <BaseButton class="user__bank-button" borderRadius="10px" color="#00AEEF" disabled height="56px">
            Привязать банковскую карту
          </BaseButton>
          <div class="user__bank-tooltip">
            <ElIcon :size="14" style="top: 2px" class="user__bank-tooltip-icon">
              <img alt="circle" src="../../assets/images/info-circle.svg"/>
            </ElIcon>
            <p class="user__bank-tooltip-text">
              В рамках национального проекта «Семья», услуга регистрации в Блокчейне - бесплатная.
            </p>
          </div>
        </div>
        <ProfileActions class="user__actions"/>
        <div v-if="viewport.isGreaterOrEquals('xl')" class="user__buttons">
          <BaseButton width="170px" class="user__btn" @click="logout">
            <ElIcon color="rgba(0, 98, 255, 1)" size="20">
              <IconsExit/>
            </ElIcon>
            Выход
          </BaseButton>
          <BaseButton width="254px" class="user__btn" style="margin-left: 30px" @click="openChangePasswordModal">
            <ElIcon color="rgba(0, 98, 255, 1)" size="20">
              <IconsLock/>
            </ElIcon>
            Изменить пароль
          </BaseButton>
        </div>

      </section>
      <section class="user__unions">
        <Unions v-if="userStore.user"/>
      </section>
    </div>
    <InviteModal/>
    <ConfirnInviteModal/>
    <CertificateModal/>
    <ChangePasswordModal/>
  </main>
</template>

<script setup>
import {useModalStore} from "~/stores/modal.js";
import {useUnionsStore} from "~/stores/unions.js";
import {useUserStore} from "~/stores/user.js";

const userStore = useUserStore()
const unionsStore = useUnionsStore()
const modalStore = useModalStore()
const viewport = useViewport()

async function logout() {
  await userStore.logout()
  await navigateTo('/')
}

function openChangePasswordModal() {
  modalStore.openModal('changePassword');
}

await useAsyncData(async () => {
  await userStore.me()
  if (userStore.user.init_invite)
    await unionsStore.getActive(userStore.user.init_invite.id)
        .then((data) => {
          if (data.status === 'disable')
            modalStore.openModal('confirmInvite')
        })
  return userStore.user
})
</script>

<style lang="scss" scoped>
.user {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;

  &__wrapper {
    flex: 1 1 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 94px;
  }

  &__main {
    justify-self: end;
    width: 100%;
    max-width: 580px;
    padding-left: 60px;
  }

  &__bank {

    margin-top: 25px;

    &-tooltip {
      display: flex;
      margin-top: 20px;
      align-items: baseline;
      max-width: 470px;

      &-icon {
        margin-right: 10px;
      }

      &-text {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: rgba(0, 98, 255, 1);
      }
    }
  }

  &__bank-button {
    width: 100% !important;
    max-width: 470px;
  }

  &__buttons {
    padding-bottom: 100px;
  }

  &__btn {
    margin: 75px 0 0;
    border: 1.5px solid rgba(0, 98, 255, 1);
    border-radius: 5px !important;
    background-color: transparent !important;
    color: rgba(0, 98, 255, 1) !important;
    width: 170px;

    font-weight: 500 !important;

    &:deep(.el-icon) {
      margin-right: 14px;
      font-weight: 500;
      font-size: 16px;
    }
  }
}

@include el.xl {
  .user {
    &__wrapper {
      grid-template-columns: 100%;
    }

    &__main {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: max-content max-content;
      gap: 20px;
      justify-self: start;
      max-width: 100%;
      padding: 0 60px 60px;
    }

    &__bank {
      grid-row: 2 / 3;
      grid-column: 1 / 2;
    }
  }
}

@include el.lg {
  .user {
    &__main {
      grid-template-columns: 1fr;
    }
    &__actions {
      grid-row: 3 / 4;
    }
  }
}

@include el.sm {
  .user {
    &__header {
      padding: 16px 20px 7px;
      background: radial-gradient(30.28% 96.32% at 36.25% 50.51%, #001256 0%, #00071F 100%);
      border-radius: 0 0 20px 20px;
    }

    &__logo {
      height: 59px;
    }

    &__main {
      padding: 0 20px 60px;
    }
  }
}
</style>

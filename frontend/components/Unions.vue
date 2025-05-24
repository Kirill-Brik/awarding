<template>
  <div class="unions">
    <img v-if="viewport.isGreaterOrEquals('sm')" alt="logo" class="unions__logo" src="../assets/images/new_logo.svg">
    <h3 class="unions__title">История СОЮЗов</h3>
    <div class="unions__description">
      <p>СОЮЗ - объединение Мужчины и Женщины.</p>
      <p>При вступлении в СОЮЗ
        предоставляется цифровое Свидетельство с возможностью регистрации в Блокчейне Банка ВТБ.</p>
      <p>Вступайте в СОЮЗ и пользуйтесь специальными предложениями
        в разделе «Мир возможностей».</p>
    </div>

    <BaseButton borderRadius="10px" class="unions__add" height="56px"
                @click="() => modalStore.openModal('createInvite')">
      Пригласить в СОЮЗ
    </BaseButton>
    <div v-if="unionsStore.unions.length === 0" class="unions__add-tooltip">
      <ElIcon :size="14" class="unions__add-tooltip-icon">
        <img alt="circle" src="../assets/images/info-circle-blue.svg"/>
      </ElIcon>
      <span class="unions__add-tooltip-text">Свидетельство появится после заключения СОЮЗа</span>
    </div>
    <ul class="unions__list">
      <li v-for="union in unionsStore.unions" :key="union.id" class="unions__item">
        <UnionCard :union="union"/>
        <BaseButton v-if="union.status === 'confirm' && !union.transaction_hash" class="unions__activation"
                    @click="sign(union.id)">
          Зарегистрировать в Блокчейн
        </BaseButton>
        <BaseButton v-else-if="union.status === 'disable' && union.guest_data.email === userStore.user.email"
                    class="unions__activation" @click="confirm(union.id)">
          К приглашению
        </BaseButton>
      </li>
    </ul>
    <div v-if="viewport.isLessThan('xl')" class="unions__buttons">
      <BaseButton width="170px" class="unions__btn" @click="logout">
        <ElIcon color="white" size="20">
          <IconsExit/>
        </ElIcon>
        Выход
      </BaseButton>
      <BaseButton width="254px" class="unions__btn" style="margin-left: 30px" @click="openChangePasswordModal">
        <ElIcon color="white" size="20">
          <IconsLock/>
        </ElIcon>
        Изменить пароль
      </BaseButton>
    </div>
    <ConfirmSignUnionModal v-model="isShowSingModal"/>
  </div>
</template>

<script setup>
import BaseButton from '@/components/base/BaseButton.vue';

const unionsStore = useUnionsStore();
const modalStore = useModalStore();
const userStore = useUserStore()
const viewport = useViewport()
const isShowSingModal = ref(false)

async function sign(id) {
  await unionsStore.getActive(id)
      .then((data) => {
        if (!data.transaction_hash) isShowSingModal.value = true;
      })
  // await unionsStore.sign(id);
}

async function confirm(id) {
  await unionsStore.getActive(id)
      .then((data) => {
        if (data.status === 'disable')
          modalStore.openModal('confirmInvite')
      })
}

async function logout() {
  await userStore.logout()
  await navigateTo('/')
}

function openChangePasswordModal() {
  modalStore.openModal('changePassword');
}

onMounted(async () => {
  await unionsStore.me();
});
</script>

<style lang="scss" scoped>
.unions {
  display: flex;
  flex-direction: column;
  padding: 44px 85px;
  height: 100%;
  color: white;
  background: url('../assets/images/personal-area.jpg') no-repeat top center / 100% auto, #00030C; /* Укажите путь к вашему изображению */
  border-radius: 20px 0 0 20px;


  &__title {
    font-size: 24px;
    font-weight: 700;
    color: rgba(255, 255, 255, 1);
    max-width: 470px;
  }

  &__description {
    font-weight: 400;
    font-size: 14px;
    margin-top: 20px;
    max-width: 470px;
    line-height: 18px;
  }

  &__add {
    margin-top: 25px;
    margin-bottom: 20px;
    max-width: 470px;

    &-tooltip {
      display: flex;
      align-items: center;

      &-icon {
        margin-right: 10px;
      }

      &-text {
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  &__list {
    gap: 20px;
    display: flex;
    flex-direction: column;
    max-width: 470px;
  }

  &__item {
    display: flex;
    flex-direction: column;
  }

  &__logo {
    align-self: center;
    padding-bottom: 30px;
  }

  &__activation {
    margin-top: 10px;
    width: 100% !important;
    border-radius: 5px !important;
  }


  &__btn {
    margin: 75px 0 0;
    border: 1.5px solid white !important;
    border-radius: 5px !important;
    background-color: transparent !important;
    color: white !important;
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
  .unions {
    padding: 44px 60px;
    border-radius: 20px 20px 0 0;

    &__list {
      max-width: 100%;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(480px, 480px));
    }
  }
}

@include el.sm {
  .unions {
    padding: 44px 20px;

    &__description {
      font-size: 12px;
      line-height: 18px;
    }

    &__list {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 30px;
    }

    &__buttons {
      display: flex;
      flex-direction: column;
      gap: 20px;
      padding: 60px 0 100px;
    }

    &__add {
      max-width: 100%;
      border-radius: 5px !important;
    }

    &__btn {
      margin: 0 !important;
    }
  }
}
</style>
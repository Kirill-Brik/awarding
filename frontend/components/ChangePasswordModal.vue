<template>
  <el-dialog v-model="modalStore.changePassword" :show-close="false" class="password" align-center
             modal-class="password__overlay">
    <template #header="{ close }">
      <el-button circle class="password__close" @click="closeModal">
        <el-icon>
          <IconsClose/>
        </el-icon>
      </el-button>
    </template>
    <div class="password__wrapper">
      <h2 class="password__title">Изменение пароля</h2>
      <div class="password__content">
        <BaseInput v-model="currentPassword" :error="apiErrors.currentPassword" height="60px" width="100%"
                   margin-bottom="0"
                   placeholder="Текущий пароль"
                   type="password" @update:model-value="clearError('currentPassword')"/>
        <BaseInput v-model="password" :error="apiErrors.password" height="60px" margin-bottom="0" width="100%"
                   placeholder="Новый пароль" type="password" @update:model-value="clearError('password')"/>
        <BaseInput v-model="passwordConfirmation" :error="apiErrors.passwordConfirmation" height="60px"
                   margin-bottom="0" width="100%" placeholder="Подтверждение нового пароля"
                   type="password" @update:model-value="clearError('passwordConfirmation')"/>
      </div>
      <ul v-if="Object.keys(apiErrors).length" class="password__error-list">
        <li v-for="(error, field) in apiErrors" :key="field" class="password__error">
          <el-icon :size="8" class="password__error-icon">
            <IconsInfo/>
          </el-icon>
          {{ error }}
        </li>
      </ul>
      <div class="password__actions">
        <BaseButton border-radius="5px" height="56px" width-large="370px" width-small="280px" @click="saveChanges"
                    :disabled="!isFormValid">
          Сохранить изменения
        </BaseButton>
        <p @click="closeModal">Отмена</p>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import {ref} from 'vue';

const modalStore = useModalStore();
const userStore = useUserStore();
const currentPassword = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const apiErrors = ref({});
const isFormValid = computed(() => Object.keys(apiErrors.value).length === 0)

const closeModal = () => {
  modalStore.closeModals();
};

function clearError(key) {
  if (apiErrors.value.main) delete apiErrors.value.main
  if (apiErrors.value[key]) delete apiErrors.value[key]
}

const saveChanges = async () => {
  const data = {
    currentPassword: currentPassword.value,
    password: password.value,
    passwordConfirmation: passwordConfirmation.value
  };


  apiErrors.value = {};

  try {
    await userStore.changePassword(data);
    modalStore.closeModals();
    ElMessage.success('Пароль успешно изменен');
    modalStore.closeModals();
  } catch (res) {
    console.error(res);
    if (res.data.error) {
      apiErrors.value = parseApiError(res.data.error);
    }
  }
};

</script>

<style lang="scss">
.password {
  &.el-dialog {
    width: calc(100% - 40px);
    max-width: 500px;
    padding: 57px 65px 50px;
    border-radius: 20px;
  }

  &__overlay {
    .el-overlay-dialog {
      padding: 20px 0;
    }
  }

  .el-dialog__header {
    position: relative;
    padding: 0;
  }
}

@include el.sm {
  .password {
    padding: 25px 20px;
  }
}
</style>

<style lang="scss" scoped>
.password {
  &__error-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: rgba(225, 67, 67, 1);
  }

  &__error {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
  }

  &__error-icon {
    --color: white;
    background-color: rgba(225, 67, 67, 1);
    border-radius: 50%;
    width: 14px;
    height: 14px;
  }

  &__wrapper {
    display: flex;
    flex-direction: column;

  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: rgba(0, 36, 118, 1);
    margin-bottom: 60px;
  }

  &__close {
    position: absolute;
    top: -5px;
    right: -30px;
  }

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 20px;
    align-items: center;

    p {
      cursor: pointer;
      color: rgba(0, 98, 255, 1);
      font-size: 16px;
      font-weight: 600;
      text-decoration: underline;
    }
  }
}

@include el.sm {
  .password {
    &__close {
      right: 0;
    }

    &__title {
      margin-bottom: 30px;
    }
  }
}
</style>

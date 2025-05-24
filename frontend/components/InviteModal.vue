<template>
  <el-dialog v-model="modalStore.createInvite" :show-close="false" class="invite" align-center
             modal-class="invite__overlay">
    <template #header="{ close, titleId, titleClass }">
      <el-button circle class="invite__close" @click="close">
        <el-icon>
          <IconsClose/>
        </el-icon>
      </el-button>
    </template>
    <div class="invite__container">
      <div class="invite__container__box">
        <div class="invite__container__box__form">
          <ElForm class="invite__form">
            <h2 class="invite__container__box__form-title">Отправить приглашение</h2>
            <h3 class="invite__container__box__form-label">
              Укажите, куда отправить Приглашение, вступить с вами в СОЮЗ
            </h3>
            <BaseInput v-model="email" placeholder="Email" :error="apiErrors.email" height="60px"
                       width="100%" @update:model-value="clearError('email')"/>
            <h3 class="invite__container__box__form-label">и ФИО вашей второй половины</h3>
            <BaseInput v-model="surname" placeholder="Фамилия" :error="apiErrors.surname" height="60px"
                       width="100%" @update:model-value="clearError('surname')"/>
            <BaseInput v-model="first_name" placeholder="Имя" :error="apiErrors.first_name" height="60px"
                       width="100%" @update:model-value="clearError('first_name')"/>
            <BaseInput v-model="middle_name" placeholder="Отчество" :error="apiErrors.middle_name" height="60px"
                       width="100%" @update:model-value="clearError('middle_name')"/>
            <BaseInput v-model="gender" :error="apiErrors.gender" width="100%"
                       :options="genderOptions" height="60px" placeholder="Пол" type="select"
                       :disabled="isDisableGender"
                       @update:model-value="clearError('gender')"/>
            <ul class="invite__error-list" v-if="apiErrors">
              <li class="invite__error" v-for="error in apiErrors">
                <ElIcon class="invite__error-icon" :size="8">
                  <IconsInfo/>
                </ElIcon>
                {{ error }}
              </li>
            </ul>
            <div class="invite__actions">
              <BaseButton :disabled="Object.keys(apiErrors).length > 0" border-radius="5px"
                          class="button invite__button"
                          style="margin-top: 50px;" width="100%" @click="submitInvitation">
                Отправить
              </BaseButton>
            </div>
          </ElForm>
        </div>
      </div>
      <div class="invite__image-wrapper">
        <img class="invite__logo" alt="logo" src="../assets/images/new_logo.svg">

        <img alt="invite" class="invite__image" src="../assets/images/invitation-back2.svg">
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import BaseInput from "~/components/base/BaseInput.vue";

const emit = defineEmits(['submit']);
const modalStore = useModalStore();
const unionStore = useUnionsStore();
const userStore = useUserStore()
const appStore = useAppStore()

const checkGender = () => {
  return  userStore.user.gender === 'male' ? 'female' : 'male'
}

const first_name = ref('');
const surname = ref('')
const middle_name = ref('')
const email = ref('');
const gender = ref(checkGender());
const unionType = ref('friend');
const genderOptions = [
  {value: 'male', label: 'Мужчина'},
  {value: 'female', label: 'Женщина'},
];
const unionTypeOptions = [
  {value: 'marriage', label: 'Брак'},
  {value: 'friendship', label: 'Дружба'},
  {value: 'colleagues', label: 'Коллеги'},
];
const isDisableGender = computed(() => {
  if (unionStore.unions.length > 0) {
    const union = unionStore.unions.find(union => union.status === 'confirm')
    if (union) return true
  }
  return false
})
const apiErrors = ref({})

const submitInvitation = async () => {
  const data = {
    guest_data: {
      email: email.value,
      first_name: first_name.value,
      surname: surname.value,
      middle_name: middle_name.value,
      gender: gender.value,
    },
    union_type: unionType.value
  }
  appStore.load(true)
  await unionStore.create(data)
      .then(() => {
        emit('submit', data);
        modalStore.closeModals();
      })
      .catch((res) => {
        console.log(res);
        if (res.data.error) apiErrors.value = parseApiError(res.data.error)
      })
      .finally(() => appStore.load(false))
};

function clearError(key) {
  if (apiErrors.value.main) delete apiErrors.value.main
  delete apiErrors.value[key]
}

watch(() => modalStore.createInvite, (newVal) => {
  if (!newVal) {
    first_name.value = ''
    surname.value = ''
    middle_name.value = ''
    email.value = '';
    gender.value = checkGender();
    unionType.value = 'friend';
  }
});
</script>

<style lang="scss" scoped>
.invite {
  &__form-item {
    width: 100%;
  }

  &__input {
    height: 60px;
  }

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

  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr;

    &__box {
      width: 100%;
      padding: 45px;

      &__form {

        &-title {
          font-size: 24px;
          font-weight: 700;
          color: rgba(0, 36, 118, 1);
          margin-bottom: 35px;
        }

        &-label {
          font-size: 16px;
          font-weight: 600;

          color: rgba(51, 51, 51, 1);
          margin-top: 10px;
          margin-bottom: 20px;
        }

      }
    }
  }

  &__image-wrapper {
    position: relative;
  }

  &__image {
    width: 100%;
    object-fit: cover;
    height: 100%;
    border-radius: 0 20px 20px 0;
    position: relative;
    z-index: 1;
  }

  &__logo {
    position: absolute;
    top: 36px;
    left: 25px;
    z-index: 2;
  }


  &__close {
    position: absolute;
    right: 20px;
    top: 20px;
    z-index: 2;
  }

  &__button {
    max-width: 370px;
  }
}

@include el.md {
  .invite {
    &__container {
      grid-template-columns: 1fr;
    }

    &__image-wrapper {
      display: none;
    }

    &__container {
      &__box {
        padding: 22px 20px;

        &__form-title {
          max-width: calc(100% - 40px);
        }
      }
    }

    &__actions {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &__button {
      margin-top: 10px !important;
    }
  }

}
</style>
<style lang="scss">
.invite {
  &.el-dialog {
    width: calc(100% - 40px);
    max-width: 970px;
    padding: 0;
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
</style>
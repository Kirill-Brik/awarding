<template>
  <el-dialog v-model="modalStore.editProfile" :show-close="false" class="edit" align-center modal-class="edit__overlay">
    <template #header="{ close }">
      <el-button circle class="edit__close" @click="closeModal">
        <el-icon>
          <IconsClose/>
        </el-icon>
      </el-button>
    </template>
    <ElForm class="edit__wrapper" label-position="top">
      <h2 class="edit__title">Редактирование</h2>
      <div class="edit__avatar-container">
        <ElUpload class="register__upload" :http-request="(option) => {option.onSuccess()}"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleAvatarSuccess" :show-file-list="false">
          <ElAvatar :size="100" :src="avatarUrl"/>
          <img alt="Редактировать фото" class="edit__edit-avatar" src="../assets/images/icon-img.svg"/>
        </ElUpload>
      </div>
      <div class="edit__content">
        <div class="edit__left">
          <BaseInput v-model="form.surname" placeholder="Фамилия" :error="apiErrors.surname" height="60px"
                     width="100%" @update:model-value="clearError('surname')"/>
          <BaseInput v-model="form.first_name" :error="apiErrors.first_name" height="60px" width="100%"
                     placeholder="Имя" @update:model-value="clearError('first_name')"/>
          <BaseInput v-model="form.middle_name" :error="apiErrors.middle_name" height="60px" width="100%"
                     placeholder="Отчество" @update:model-value="clearError('middle_name')"/>
          <BaseInput v-model="form.phone" v-bind="phoneMask" :error="apiErrors.phone" height="60px" width="100%"
                     placeholder="Номер телефона" @update:model-value="clearError('phone')"/>
          <BaseInput v-model="form.gender" :error="apiErrors.gender" :disabled="isDisableGender" width="100%"
                     :options="genderOptions" height="60px" placeholder="Пол" type="select"
                     @update:model-value="clearError('gender')"/>
        </div>
        <div class="edit__right">
          <BaseInput v-model="form.date_of_birth" :error="apiErrors.date_of_birth" height="60px" width="100%"
                     placeholder="Дата рождения" type="date"
                     @update:model-value="clearError('date_of_birth')"/>
          <BaseInput v-model="form.about" :error="apiErrors.about" placeholder="О себе" type="textarea" width="100%"
                     @update:model-value="clearError('about')"/>
          <ul class="invite__error-list" v-if="apiErrors">
            <li class="invite__error" v-for="error in apiErrors">
              <ElIcon class="invite__error-icon" :size="8">
                <IconsInfo/>
              </ElIcon>
              {{ error }}
            </li>
          </ul>
        </div>
      </div>
      <div class="edit__actions">
        <BaseButton border-radius="5px" height="56px" width-large="370px" width-small="280px"
                    @click="saveChanges" :disabled="!isFormValid">
          Сохранить изменения
        </BaseButton>
        <p @click="closeModal">Отмена</p>
      </div>
    </ElForm>
  </el-dialog>
</template>

<script setup>
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import {ElMessage} from "element-plus";
import {defineEmits, defineProps, ref, watch} from 'vue';
import emptyAvatar from '~/assets/images/avatar.svg'

const props = defineProps({
  user: Object
});
const emit = defineEmits(['close']);
const modalStore = useModalStore();
const userStore = useUserStore();
const appStore = useAppStore()
const unionsStore = useUnionsStore()
const config = useRuntimeConfig();
const phoneMask = usePhoneMask()

const form = ref(getCurrentUser(props.user));

const genderOptions = [
  {value: 'male', label: 'Мужчина'},
  {value: 'female', label: 'Женщина'},
];
const isDisableGender = computed(() => {
  if (unionsStore.unions.length > 0) {
    const union = unionsStore.unions.find(union => union.status === 'confirm')
    if (union) return true
  }
  return false
})

const apiErrors = ref({})

const isFormValid = computed(() => Object.keys(apiErrors.value).length === 0)

watch(() => props.user, (newVal) => {
  form.value = getCurrentUser((newVal));
});

function clearError(key) {
  if (apiErrors.value.main) delete apiErrors.value.main
  if (apiErrors.value[key]) delete apiErrors.value[key]
}

function getCurrentUser(user) {
  const keyList = ['surname', 'first_name', 'middle_name', 'avatar', 'email', 'phone', 'gender', 'date_of_birth', 'about'];
  const result = {}
  keyList.forEach(key => {
    result[key] = user[key];
  })
  return result
}

const avatarUrl = computed(() => {
  if (form.value.avatar) {
    if (form.value.avatar instanceof File) return URL.createObjectURL(form.value.avatar)
    else return config.public.serverBase + form.value.avatar.url
  } else return emptyAvatar
});

const handleAvatarSuccess = (response, uploadFile) => {
  form.value.avatar = uploadFile.raw
}

const beforeAvatarUpload = (rawFile) => {
  console.log(rawFile.type)
  if (!rawFile.type.match(/^image\/(png|jpg|jpeg|gif|webp)$/)) {
    ElMessage.error('Недопустимый формат')
    return false
  } else if (rawFile.size / 1024 / 1024 > 10) {
    ElMessage.error('Размер файла должен быть меньше 10MB')
    return false
  }
  return true
}

const closeModal = () => {
  modalStore.closeModals();
};

const saveChanges = async () => {
  appStore.load(true)
  await userStore.update(form.value)
      .then(() => closeModal())
      .catch((res) => {
        console.log(res);
        if (res.data.error) apiErrors.value = parseApiError(res.data.error)
      })
      .finally(() => appStore.load(false))
};
</script>

<style lang="scss">
.edit {
  &.el-dialog {
    width: calc(100% - 40px);
    max-width: 850px;
    padding: 35px;
    border-radius: 20px;
  }

  &__overlay {
    .el-overlay-dialog {
      padding: 20px 0;
    }
  }

  &__wrapper {
    display: flex;
    flex-direction: column;
  }

  &__form-item {
    position: relative;

    .el-form-item__label {
      position: absolute;
      top: 10px;
      left: 15px;
      z-index: 1;
      margin: 0;
      padding: 0;
      color: rgba(186, 186, 186, 1);
      font-size: 14px;
      font-weight: 500;
      line-height: 10px !important;
    }
  }

  &__input {
    width: 100%;
  }

  &__title {
    font-size: 40px;
    font-weight: 700;
    color: rgba(0, 36, 118, 1);
    margin-bottom: 30px;
  }

  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  &__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
  }

  &__left, &__right {
    display: flex;
    flex-direction: column;
  }

  &__avatar-container {
    position: relative;
    width: 100px;
    margin-bottom: 24px;
  }

  &__avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  &__edit-avatar {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  &__subtitle {
    font-size: 24px;
    font-weight: 700;
    color: rgba(0, 36, 118, 1);
    margin-top: 30px;
    margin-bottom: 60px;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

@include el.md {
  .edit {
    &__content {
      grid-template-columns: 1fr;
      gap: 0;
    }
  }
}

@include el.sm {
  .edit {
    &__title {
      font-size: 24px;
      line-height: 28px;
    }
  }
}
</style>

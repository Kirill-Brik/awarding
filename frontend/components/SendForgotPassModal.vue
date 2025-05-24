<template>
  <el-dialog v-model="isOpen" :show-close="false" class="sign-union" align-center modal-class="sign-union__overlay">
    <h2 class="sign-union__title">Письмо отправлено</h2>
    <p class="sign-union__text">Письмо с восстановлением пароля успешно отправлено на указанный e-mail.</p>
    <div class="sign-union__actions">
      <BaseButton class="sign-union__action" @click="close">Закрыть</BaseButton>
    </div>
  </el-dialog>
</template>

<script setup>
const isOpen = defineModel({default: false})

async function close() {
  isOpen.value = false
  navigateTo('/')
}
</script>
<style lang="scss">
.sign-union {
  &.el-dialog {
    border-radius: 20px;
    width: calc(100% - 40px);
    max-width: 510px;
    padding: 46px 65px;
  }

  .el-dialog__header {
    display: none;
    padding: 0;
  }

  &__overlay {
    .el-overlay-dialog {
      padding: 20px 0;
    }
  }
}

@include el.sm {
  .sign-union {
    padding: 30px 20px;
  }
}
</style>


<style scoped lang="scss">
.sign-union {
  &__title {
    margin-bottom: 45px;
    font-size: 24px;
    font-weight: 700;
    color: #002476;
  }

  &__text {
    margin-bottom: 45px;
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  &__action {
    margin: 0;
    height: 45px !important;
    width: 100% !important;
    max-width: 170px !important;
    border-radius: 5px !important;

    &_white {
      background-color: white !important;
      color: #0062FF !important;
      border: 2px solid #0062FF;
    }
  }
}

@include el.sm {
  .sign-union {
    &__title {
      margin-bottom: 30px;
    }

    &__text {
      margin-bottom: 30px;
    }

    &__actions {
      flex-direction: column;
      align-items: center;
    }

    &__action {
      max-width: 100% !important;
    }
  }
}
</style>

<template>
  <el-dialog v-model="isOpen" :show-close="false" class="gender-union" align-center modal-class="gender-union__overlay">
    <template #header="{ close }">
      <el-button circle class="gender-union__close" @click="close">
        <el-icon>
          <IconsClose/>
        </el-icon>
      </el-button>
    </template>
    <h2 class="gender-union__title">Невомозожно принять приглашение</h2>
    <p class="gender-union__text">СОЮЗ возможен между мужчной и женщиной.</p>
<!--    <div class="gender-union__actions">-->
<!--      <BaseButton class="gender-union__action" @click="openEditProfile">Редактировать профиль</BaseButton>-->
<!--      <BaseButton class="gender-union__action gender-union__action_white" @click="isOpen = false">Отказать</BaseButton>-->
<!--    </div>-->
  </el-dialog>
</template>

<script setup>
const isOpen = defineModel({default: false})
const modalStore = useModalStore();

function openEditProfile() {
  isOpen.value = false
  modalStore.openModal('editProfile')
}
</script>
<style lang="scss">
.gender-union {
  &.el-dialog {
    padding: 60px 65px;
    border-radius: 20px;
    width: calc(100% - 40px);
    max-width: 575px;
  }

  .el-dialog__header {
    //display: none;
    padding: 0;
  }

  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  &__overlay {
    .el-overlay-dialog {
      padding: 20px 0;
    }
  }
}

@include el.sm {
  .gender-union {
    &.el-dialog {
      padding: 30px 20px;
    }
  }
}
</style>


<style scoped lang="scss">
.gender-union {
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
    padding: 0 30px;
    margin: 0;
    height: 45px !important;
    border-radius: 5px !important;

    &_white {
      background-color: white !important;
      color: #0062FF !important;
      border: 2px solid #0062FF;
    }
  }
}

@include el.sm {
  .gender-union {
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
      width: 100% !important;
      max-width: 100% !important;
    }
  }
}
</style>

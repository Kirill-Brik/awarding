<template>
  <el-dialog v-model="modalStore.certificateModal"
             :show-close="false" class="certificate-modal" @closed="unionsStore.active = null" align-center
             modal-class="certificate-modal__overlay">
    <template #header="{ close }">
      <el-button circle class="certificate-modal__close" @click="close">
        <el-icon>
          <IconsClose/>
        </el-icon>
      </el-button>
    </template>
    <div ref="scaleTarget" class="certificate-modal__wrapper">
      <Certificate v-if="unionsStore.active && scaleTarget" class="certificate-modal__certificate"
                   :union="unionsStore.active" :scale-target="scaleTarget" is-mobile/>
    </div>
  </el-dialog>
</template>

<script setup>
const modalStore = useModalStore();
const unionsStore = useUnionsStore();
const scaleTarget = ref()


onMounted(() => {
  // scaleTarget.value = document.body
})
</script>

<style lang="scss">
.certificate-modal {
  &.el-dialog {
    width: calc(100% - 40px);
    max-width: 595px;
    padding: 0;
    border-radius: 20px;
    overflow: hidden;
  }

  .el-dialog__header {
    padding: 0;
  }

  &__overlay {
    .el-overlay-dialog {
      padding: 20px 0;
    }
  }

  &__close {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 1;
  }

}
</style>

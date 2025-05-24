<template>
  <el-dialog v-model="isOpen" class="voucher" :show-close="false" align-center modal-class="voucher__overlay">
    <template #header="{ close }">
      <el-button circle class="voucher__close" @click="close">
        <el-icon>
          <IconsClose/>
        </el-icon>
      </el-button>
    </template>
    <div class="voucher__image-wrapper" :style="{'--size': aspectRatio}">
      <img class="voucher__image" :src="img">
    </div>
  </el-dialog>
</template>

<script setup>
const isOpen = defineModel({default: false})
const props = defineProps({
  img: {
    type: String,
    required: true
  },
  aspectRatio: {
    type: Number,
    default: 1,
  }
})
const test = ref(1)
</script>
<style lang="scss">
.voucher {
  &.el-dialog {
    border-radius: 20px;
    width: calc(100% - 40px);
    max-width: 595px;
    padding: 0;
    overflow: hidden;
  }

  .el-dialog__header {
    //display: none;
    padding: 0;
  }

  &__overlay {
    .el-overlay-dialog {
      padding: 20px 0;
    }
  }
}
</style>


<style scoped lang="scss">
.voucher {
  &__close {
    position: absolute;
    z-index: 1;
    right: 10px;
    top: 10px;
  }

  &__image-wrapper {
    width: 100%;
    height: 0;
    padding-top: calc(var(--size) * 100%);
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>

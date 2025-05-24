<template>
  <el-button
      :disabled="disabled"
      :icon="icon"
      :style="mergedStyles"
      :type="type"
      v-bind="$attrs"
      @click="handleClick"
  >
    <slot></slot>
  </el-button>
</template>

<script setup>
import { computed, defineEmits, defineProps, onMounted, ref } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  icon: String,
  color: {
    type: String,
    default: '#0062FF',
  },
  borderRadius: {
    type: String,
    default: '52px',
  },
  width: {
    type: String,
    default: 'auto',
  },
  height: {
    type: String,
    default: '56px',
  },
  widthLarge: {
    type: String,
    default: null,
  },
  widthSmall: {
    type: String,
    default: null,
  },
  openModal: Function,
});

const emit = defineEmits(['click']);

const screenSize = ref(null);

const handleResize = () => {
  screenSize.value = window.innerWidth;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

const handleClick = (event) => {
  if (props.openModal) {
    props.openModal();
  }
  emit('click', event);
};

const buttonStyles = computed(() => {
  let backgroundColor = props.color;
  let borderColor = props.color;
  let textColor = 'white';

  if (props.disabled) {
    backgroundColor = 'rgba(0, 98, 255, 0.3)';
    borderColor = 'rgba(0, 98, 255, -0.9)';
  }

  return {
    backgroundColor,
    borderColor,
    borderRadius: props.borderRadius,
    width: props.width,
    height: props.height,
    color: textColor,
    cursor: props.disabled ? 'not-allowed' : 'pointer',
  };
});

const mergedStyles = computed(() => {
  let width;
  if (screenSize.value <= 776 && props.widthSmall) {
    width = props.widthSmall;
  } else if (screenSize.value > 776 && props.widthLarge) {
    width = props.widthLarge;
  } else {
    width = props.width;
  }

  return {
    ...buttonStyles.value,
    width,
  };
});
</script>


<style lang="scss" scoped>
.el-button {
  padding: 0 15px;
  font-size: 16px;
  font-weight: 600;
  line-height: 150%;
  transition: background-color 0.3s, border-color 0.3s;

  &:hover {
    filter: brightness(0.9);
  }

  @include el.md {
    width: 320px;
    height: 50px;
  }
}
</style>

<template>
  <div>
    <el-form-item v-if="type !== 'checkbox'" :error="error" class="custom-form-item" label-position="top">

      <el-input
          v-if="type !== 'select' && type !== 'date' && type !== 'textarea' && type !== 'password'"
          v-model="modelValue"
          :class="['custom-input', { 'is-error': showError }]"
          :placeholder="placeholder"
          :style="inputStyles"
          :type="type"
          autocomplete="off"
          v-bind="$attrs"
      />
      <el-date-picker
          v-else-if="type === 'date'"
          v-model="modelValue"
          value-format="YYYY-MM-DD"
          :style="inputStyles"
          autocomplete="off"
          class="custom-input"
          format="DD-MM-YYYY"
          :placeholder="placeholder"
          type="date"
          v-bind="$attrs"
      />
      <el-select
          v-else-if="type === 'select'"
          v-model="modelValue"
          :placeholder="placeholder"
          :style="inputStyles"
          autocomplete="off"
          class="custom-input"
          v-bind="$attrs"
      >
        <el-option
            v-for="option in options"
            :key="option.value"
            :label="option.label"
            :value="option.value"
        />
      </el-select>
      <el-input
          v-else-if="type === 'textarea'"
          v-model="modelValue"
          :placeholder="placeholder"
          :style="textareaStyles"
          class="text_area"
          maxlength="300"
          resize="vertical"
          show-word-limit
          type="textarea"
          v-bind="$attrs"
      />
      <el-input
          v-else-if="type === 'password'"
          v-model="modelValue"
          :placeholder="placeholder"
          :style="inputStyles"
          show-password
          type="password"
          v-bind="$attrs"
      />
      <label v-if="modelValue" class="floating-label">{{ placeholder }}</label>

      <!-- <div v-if="showError && error !== 'Поле не может быть пустым'" class="error-message">{{error}}</div>-->

    </el-form-item>
    <el-form-item v-if="type === 'checkbox'" class="custom-form-item-checkbox">
      <el-checkbox v-model="modelValue" :style="checkboxStyles" class="custom-checkbox">
        <slot></slot>
      </el-checkbox>
    </el-form-item>
  </div>
</template>


<script setup>
import {computed, defineProps, onMounted, ref} from 'vue';

const modelValue = defineModel();

const props = defineProps({
  label: String,
  error: String,
  type: {
    type: String,
    default: 'text',
  },
  options: {
    type: Array,
    default: () => [],
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'small', 'medium', 'large'].includes(value),
  },
  rounded: {
    type: Boolean,
    default: false,
  },
  width: {
    type: String,
    default: '100%',
  },
  widthLarge: {
    type: String,
    default: '100%',
  },
  widthSmall: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '54px',
  },
  placeholder: String,
  marginBottom: {
    type: String,
    default: '15px',
  },
});

const showError = computed(() => props.error && props.error.length > 0);

const borderRadius = computed(() => {
  return props.rounded ? '52px' : '5px';
});

const screenSize = ref(null);

const handleResize = () => {
  screenSize.value = window.innerWidth;
};

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

const inputStyles = computed(() => {
  const width = screenSize.value <= 776 ? props.widthSmall : props.widthLarge;
  return {
    width,
    '--custom-border-radius': borderRadius.value,
    height: props.height,
    'margin-bottom': props.marginBottom,
  };
});

const textareaStyles = computed(() => ({
  width: props.width,
  '--custom-border-radius': borderRadius.value,
  'margin-bottom': props.marginBottom,
}));

const checkboxStyles = computed(() => ({
  'margin-bottom': props.marginBottom,
}));
</script>


<style lang="scss" scoped>
$red: rgba(241, 0, 0, 1);
.custom-form-item {
  margin-bottom: 10px;
  margin-left: 0;
  display: flex;
  flex-direction: column;
  font-weight: 500;
  font-size: 16px;
  color: rgba(0, 0, 0, 1);

  @include el.md {
    width: v-bind(widthSmall) !important;
  }

  :deep(.el-form-item__content) {
    width: auto;
    height: 60px;
  }

  :deep(.el-form-item__error) {
    display: none;
  }

  .el-form-item__label {
    justify-content: flex-start !important;
    display: flex;
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .custom-input {
    &.is-error {
      border-color: $red !important;
    }

    &::placeholder {
      text-align: center;
    }

    :deep(.el-select__placeholder) {
      font-weight: 500;
      font-size: 16px;
    }

    &.is-error::placeholder {
      color: $red !important;
    }
  }

  :deep(.el-select__wrapper) {
    height: 100%;
  }

  :deep(.el-input__wrapper) {
    border-radius: var(--custom-border-radius) !important;
    height: 100%;
    border-color: rgba(10, 41, 115, 0.5) !important;
  }

  :deep(.el-input__inner) {
    height: 100%;
    font-weight: 500;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
  }

  :deep(.el-textarea__inner) {
    min-height: 60px !important;
    padding-top: 20px;
    max-height: 314px;
    font-weight: 500;
    font-size: 16px;
    color: rgba(0, 0, 0, 1);
  }

  :deep(.el-form-item__label) {
    justify-content: flex-start;
    color: rgba(186, 186, 186, 1);
  }

  .error-message {
    color: $red;
    margin-top: 5px;
    font-size: 0.875rem;
  }

  .floating-label {
    position: absolute;
    top: -4px;
    left: 10px;
    font-size: 12px;
    color: rgba(186, 186, 186, 1);
    transition: all 0.3s;
    pointer-events: none;
  }
}

.custom-form-item-checkbox {
  margin-bottom: 10px;
  margin-left: 0;

  :deep(.el-checkbox__inner) {
    width: 16px;
    height: 16px;
    border: 1px solid rgba(10, 41, 115, 1);
    margin: 0;
  }

  :deep(.el-checkbox__inner:after) {
    left: 5px;
  }

  .custom-checkbox {
    display: flex;
    align-items: center;
  }
}
</style>


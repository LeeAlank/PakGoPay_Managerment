<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <button class="close" type="button" @click="closeModal" aria-label="Close">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>
      <img style="width: 100%;height: 100%;" alt="QrCode" :src="imgUrl"/>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      default: false
    },
    imgUrl: ''
  },
  methods: {
    closeModal() {
      this.$emit('close');
    }
  }
}
</script>

<style>
.modal {
  position: fixed;
  z-index: 1;
  left: 3%;
  top: 20%;
  width: 500px;
  height: 500px;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}
.modal-content {
  background-color: #fefefe;
  /*margin: 15% auto;*/

  margin-left: 9%;
  margin-top: 9%;
  width: 400px;
  height:400px;
}
.close {
  border: none;
  padding: 0;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.close:hover,
.close:focus {
  color: #111827;
  outline: none;
}
.close svg {
  width: 18px;
  height: 18px;
}
</style>

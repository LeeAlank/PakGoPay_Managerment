<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content">
      <div class="close" @click="closeModal">&times;</div>
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
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>

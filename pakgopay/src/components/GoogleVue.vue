<template>
  <div>
    <button @click="signIn">Sign in with Google</button>
  </div>
</template>

<script>
import {googleAuthCodeLogin} from "vue3-google-login";
const login = () => {
  googleAuthCodeLogin().then(response => {
    console.log("auth",response);
  })
}

export default {
  name: 'GoogleLogin',
  methods: {
    signIn() {
      this.$refs.googleOAuthProvider.signIn();
    },
    onSignIn(googleUser) {
      // 获取用户信息
      let profile = googleUser.getBasicProfile();
      console.log('ID: ' + profile.getId()); // Do not send to your backend! Use profileObj below.
      console.log('Name: ' + profile.getName());
      console.log('Image URL: ' + profile.getImageUrl());
      console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    },
  },
};
</script>

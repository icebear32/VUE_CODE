<template>
  <div id="app">
    <img src="./assets/logo.png">
    <br/>
    <router-link to="/">Home</router-link>
    <router-link to="/params/198/ich website is very good">params</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

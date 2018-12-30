<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      console.log('reloading')
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
#app {
  background: linear-gradient(#1F1F3E, #111133);
  position: absolute;
  background-repeat: repeat;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  margin: 0px;
  padding: 0;
  border: 0;
  font-family: 'Montserrat'
}
</style>

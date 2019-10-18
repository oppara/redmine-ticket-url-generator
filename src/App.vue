<template>
  <div id="app">
    <div class="hello">
      <h1>Redmine Ticket Url Generator</h1>
    </div>
    <FormElement />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FormElement from './components/FormElement.vue';

@Component({
  components: {
    FormElement,
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px auto;
  width: 80%;
}
</style>

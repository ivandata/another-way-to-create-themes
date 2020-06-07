<template>
  <div id="app" class="app">
    <button class="trigger" title="Theme color mode" @click="changeTheme">
      <span class="icon"></span>
    </button>
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import themes from './lib/dist/themes.json';

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  data() {
    return {
      theme: 0
    }
  },
  watch: {
    theme(newName) {
      localStorage.theme = newName;
      document.body.setAttribute('data-theme', themes.themes[this.theme]);
    }
  },
  mounted() {
    if (localStorage.theme) {
      this.theme = localStorage.theme;
    }
    document.body.setAttribute('data-theme', themes.themes[this.theme]);
  },
  methods: {
    changeTheme() {
      this.theme = this.theme < (themes.themes.length - 1) ? ++this.theme : 0;
    }
  }
}
</script>

<style lang="scss">
.app {
  position: relative;
  padding: var(--spacing-layout-02) var(--spacing-layout-04);
}
.trigger {
  position: absolute;
  top: var(--spacing-layout-02);
  right: var(--spacing-layout-04);
  display: flex;
  background-color: var(--color-interactive-default);
  padding: var(--spacing-content-01) var(--spacing-content-01);
  border: var(--border-element-02) transparent;

  .icon {
    position: relative;
    display: inline-block;
    background: linear-gradient(-90deg, var(--color-background-page-primary) 50%, var(--color-interactive-default) 50%);
    border-radius: var(--border-radius-s);
    height: 20px;
    width: 20px;
  }

  &:hover {
    background-color: var(--color-interactive-hover);

    .icon {
      background: linear-gradient(-90deg, var(--color-background-page-primary) 50%, var(--color-interactive-hover) 50%);
    }
  }

  &:focus,
  &:active {
    background-color: var(--color-interactive-active);

    .icon {
      background: linear-gradient(-90deg, var(--color-background-page-primary) 50%, var(--color-interactive-active) 50%);
    }
  }
}
</style>


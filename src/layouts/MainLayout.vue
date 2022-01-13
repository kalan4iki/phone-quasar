<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>

        <q-toolbar-title>
          Список телефонов
        </q-toolbar-title>

        <!-- <div><q-btn flat color="" label="Закрыть" v-on:click='hidewindow' /></div> -->
      </q-toolbar>
    </q-header>


    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  data () {
    return {
      leftDrawerOpen: false,
    }
  },
  methods: {
    hidewindow: function () {
      const { ipcRenderer } = require('electron')
      // console.log(ipcRenderer)
      ipcRenderer.send('hide-window-user')
    }
  }
}
</script>

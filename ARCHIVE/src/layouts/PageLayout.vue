<template>
  <q-layout view="hHh LpR fFf">
<!-- HEADER -->
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          icon="menu"
          aria-label="Menu"
          id="main_drawer_btn"
        />

        <q-toolbar-title class="absolute-center">
          {{ textTemplate[0]}}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

<!-- DRAWER LEFT -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
      :breakpoint="768">
      <q-list>
        <q-item-label header>{{ textTemplate[39]}}</q-item-label>
        <q-item
          clickable
          exact
          v-for="nav in Navs"
          :key="nav.label"
          :to="nav.to"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar>
            <q-icon :name="nav.icon" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ nav.label }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

<!-- PAGE CONTAINER -->
    <q-page-container>
      <div class="row justify-center">
        <div class="col-12" style="width:600px">
          <keep-alive>
            <router-view/>
          </keep-alive>
        </div>
      </div>
    </q-page-container>

<!-- FOOTER -->
    <q-footer elevated class="bg-grey-8 text-white">
      <q-tabs>
        <q-route-tab
          v-for="nav in Navs"
          :key="nav.label"
          :icon="nav.icon"
          :to="nav.to"
        />
      </q-tabs>
    </q-footer>

<!-- ENDE: q-layout -->
  </q-layout>
</template>

<script>

import Navs from '../helper/navs.js'
import textTemplate from '../helper/textTemplate'

export default {
  name: 'MyLayout',

  data () {
    return {
      leftDrawerOpen: false,
      Navs: Navs,
      textTemplate: textTemplate
    }
  }
}
</script>

<style>
  @media screen and (min-width: 768px){
    .q-footer{
      display: none;
    }
  }

  @media screen and (max-width: 768px){
    #main_drawer_btn{
      display: none;
    }
    .q-header {
      height:40px;
    }
  }

</style>

<template>
  <q-layout view="lHh Lpr lFf" :class="{ 'my-selector': $q.platform.is.cordova }">
    <q-page-container>
      <router-view name="timer" />
    </q-page-container>
  </q-layout>
</template>


<script>

</script>

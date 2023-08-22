<template>
  <q-page data-cy="page_about" class="full-height">
    <q-btn icon="close" size="lg" flat round class="absolute-top-right" @click="goBack()" />

    <div class="column text-center" style="height: 100vh; width: 100vw">
      <div class="col-1">InviteFriends</div>
      <!-- TIMER ELEMENT -->
      <div class="col-11 flex flex-center ">
        <q-btn no-caps class="my-main-btn" @click="$router.go(-1)">Feature coming soon ...</q-btn>
      </div>



    </div>

  </q-page>
</template>

<script>

export default {
  name: 'InviteFriends',
  components: {

  },
  data() {
    return {

    }
  },
  mounted() {

  },

  computed: {

  },

  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}

</script>

<template>
  <q-page data-cy="page_about" class="full-height">
    <q-btn icon="close" size="lg" flat round class="absolute-top-right" @click="goBack()" />
    <div class="flex flex-center">
      InviteFriends
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

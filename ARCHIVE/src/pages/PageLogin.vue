<template>
  <q-page padding>
    <div class="row q-pa-sm">
    <q-badge v-show="showSignOut" color="info" transparent>
      {{textTemplate[51]}}: {{userName}}
    </q-badge>
    </div>
    <div v-if="!showSignOut">
      <q-btn @click="toggleSignUp" icon="link">{{showLabel}}</q-btn>
      <div v-show="showSignUp" class="doc-container text-center">
        <SignUp />
      </div>
      <div v-show="!showSignUp" class="doc-container text-center">
        <SignIn />
      </div>
    </div>

    <div v-else class="doc-container text-center">
      <SignOut />
    </div>
  </q-page>
</template>

<script>
import textTemplate from '../helper/textTemplate'
import SignUp from '../components/auth/signup'
import SignIn from '../components/auth/signin'
import SignOut from '../components/auth/signout'
import * as auth from '../auth/auth'

export default {
  data () {
    return {
      textTemplate: textTemplate,
      showSignUp: false,
      showLabel: textTemplate[40]

    }
  },
  methods: {
    toggleSignUp () {
      this.showSignUp = !this.showSignUp
      if (this.showSignUp) {
        this.showLabel = this.textTemplate[48]
      } else {
        this.showLabel = this.textTemplate[40]
      }
    }
  },
  components: {
    SignUp,
    SignIn,
    SignOut
  },
  computed: {
    showSignOut () {
      return auth.checkAuth()
    },
    userName () {
      return auth.userName()
    }
  }
}

</script>

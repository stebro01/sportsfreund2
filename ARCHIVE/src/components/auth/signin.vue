<template>
  <q-form>
    <h6>{{ textTemplate[48] }}</h6>
    <div class="q-gutter-md column">
      <q-input v-model="email" type="email" :hint="textTemplate[41]" outlined required>
        <q-badge v-show="Error_Email>0" color="red" transparent :label="textTemplate[45]"/>
      </q-input>
      <q-input v-model="password" type="password" :hint="textTemplate[42]" outlined/>
    </div>
    <q-btn :disable="noError" class="q-mt-lg inactive" @click="onSubmit">{{ textTemplate[48] }}</q-btn>
    <br>
     <q-badge v-show='submitError !== ""' color="warning" transparent :label="submitError"/>
     <q-badge v-show='submitSuccess !== ""' color="info" transparent :label="submitSuccess"/>
  </q-form>
</template>

<script>
import textTemplate from '../../helper/textTemplate'
import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  data () {
    return {
      textTemplate: textTemplate,
      email: '',
      password: '',
      submitError: '',
      submitSuccess: ''
    }
  },
  methods: {
    onSubmit () {
      this.submitError = ''
      this.submitSuccess = ''
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then((result) => {
          this.submitSuccess = this.textTemplate[49]
          this.$store.dispatch('userLogin', result)
          this.$router.push('/')
        }).catch((error) => {
          this.submitError = error.message
        })
    }
  },
  computed: {
    noError () {
      if (this.Error_Email) {
        return true
      } else {
        return false
      }
    },
    Error_Email () {
      // eslint-disable-next-line no-control-regex
      var re = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/
      return !re.test(this.email)
    }
  }
}
</script>

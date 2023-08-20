<template>
  <q-page padding>
    <div class="doc-container">
      <div class="row q-pa-sm">
        <div class="col-12 q-mt-sm q-mb-lg">
          <span class="text-h4"> {{textTemplate[38]}} </span>
        </div>
      </div>

      <q-banner v-if="!isLoggedIn" class="bg-primary text-white">
        {{ textTemplate[53] }}
        <template v-slot:action>
          <q-btn flat color="white" :label="textTemplate[48]" @click="$router.push('/login')"/>
        </template>
      </q-banner>

      <div v-else class="row justify-center q-mt-lg">
        <div class="col-12 text-center">
            <q-btn @click="loadWorkoutsFromDB">
            Daten einlesen
          </q-btn>
        </div>

        <div class="col-12 text-center">
            <q-btn @click="loadFirebaseDB">
            Firebase einlesen
          </q-btn>
        </div>

        <div class="col-10 text-center q-mt-lg">
          <hr>
            <div class="row">
              <div class="col-12 text-caption">
                STORAGE: {{ db_name }}
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 q-mb-xs" v-for="(entry, ind) in DB_ENTRY" :key="entry.workout+ind">
                {{entry.workout}}: {{entry.repeat}} [{{entry.date}}]
              </div>
            </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import textTemplate from '../helper/textTemplate'
// import LOG from '../helper/my_log'
import * as LOCALDB from '../store/localDB'
import * as auth from '../auth/auth'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

export default {
  data () {
    return {
      textTemplate: textTemplate,
      DB_ENTRY: [],
      db_name: LOCALDB.labelLocalDB
    }
  },
  methods: {
    loadWorkoutsFromDB () {
      LOCALDB.loadDB('workouts')
        .then((res) => {
          this.DB_ENTRY = res
        })
    },
    loadFirebaseDB () {
      const userID = firebase.auth().currentUser.uid
      var database = firebase.database()
      console.log(userID)
      database.ref('/workouts' + userID).set({ date: 'mie', user: 'dsfe@se.de' })

      var firebaseRef = database.ref('/workouts' + userID)
      firebaseRef.child('user').on('value', snap => {
        console.log(snap.val())
      })
    }
  },
  computed: {
    isLoggedIn () {
      return auth.checkAuth()
    }
  }
}
</script>

<style lang="stylus">
  ul {
    list-style-type: none;
  }

</style>

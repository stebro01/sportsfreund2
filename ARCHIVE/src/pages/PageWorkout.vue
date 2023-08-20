<template>

  <q-page padding >
      <div class="row q-pa-sm" >
        <div class="col-12" >
          <div class="row">
            <div class="col-8 q-mt-sm q-mb-lg">
              <span class="text-h4"> {{textTemplate[5]}} </span>
            </div>
            <div class="col-4 text-left text-weight-thin">
              <q-toggle :label="textTemplate[6]" v-model="$store.state.settings[0].value" color="primary" />
              <q-toggle :label="textTemplate[7]" v-model="$store.state.settings[1].value" color="primary" style="margin-top: -10px"/>
            </div>
          </div>

          <WorkoutView
            v-for="(workout, index) in this.$store.state.workouts"
            :key="workout.label+workout.ID"
            :workout="workout"
            :ind="index"
            :editWorkout="$store.state.settings[1].value"
            @deleteWorkout="deleteWorkout"
          />
        </div>
      </div>
      <q-btn
        :label="textTemplate[8]"
        v-show="$store.state.settings[1].value"
        @click='prompt = true'
      />

      <!-- DIALOG -->
      <q-dialog v-model="prompt" persistent>
        <q-card style="min-width: 350px">
          <q-card-section>
            <div class="text-h6">{{textTemplate[9]}}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input dense v-model="newLabel" autofocus @keyup.enter="addWorkout" />
            <q-input dense v-model="newGoal" autofocus @keyup.enter="addWorkout" />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn flat :label="textTemplate[10]" v-close-popup />
            <q-btn flat :label="textTemplate[11]" @click="addWorkout" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
  </q-page>
</template>

<script>
import WorkoutView from '../components/WorkoutView'
import textTemplate from '../helper/textTemplate'

export default {
  name: 'MyLayout',

  data () {
    return {
      prompt: false,
      newLabel: this.$store.state.workout_template.label,
      newGoal: this.$store.state.workout_template.repeat,
      textTemplate: textTemplate
    }
  },
  created () {
    this.$store.dispatch('loadDBLocal', { storage: 'settings' })
  },
  components: {
    WorkoutView
  },
  methods: {
    deleteWorkout (value) {
      this.$store.dispatch('deleteWorkout', value)
    },

    addWorkout () {
      this.prompt = false
      this.$store.dispatch('addWorkout', { label: this.newLabel, goal: this.newGoal })
    }
  }
}
</script>

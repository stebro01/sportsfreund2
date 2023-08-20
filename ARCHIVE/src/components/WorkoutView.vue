<template>
    <div class="container q-mb-xl">
      <div class="row q-mb-md">
        <div class="col-8 text-h6 float-left flex">
            <q-slide-item v-show="editWorkout" @top="move_down" @bottom="move_up" style="width:60px; margin-top:-10px" top-color="white" bottom-color="white">
              <template v-slot:top>
                <q-icon name="keyboard_arrow_down" />
              </template>
              <template v-slot:bottom>
                <q-icon name="keyboard_arrow_up" />
              </template>

              <q-item style="height: 30px">
                <q-item-section avatar>
                  <q-avatar color="light" text-color="dark" icon="reorder" />
                </q-item-section>
              </q-item>
            </q-slide-item>
            <div
              v-if="editLabel"
              contenteditable="true"
              @blur="EndInput"
              @keydown.enter="EndInput"
              class="editable"
            >
              {{ label }}
            </div>
            <div v-else>
              {{ label }}
            </div>
        </div>

        <div class="col-4">
          <div class="float-right">
            <q-btn
            icon="edit"
            v-show="!editLabel & editWorkout"
            @click="toggleEditLabel"
            />
            <q-btn
              icon="delete"
              v-show="editWorkout"
              @click="confirm = true"
            />
          </div>

          <q-dialog v-model="confirm" persistent>
            <q-card>
              <q-card-section class="row items-center">
                <q-avatar icon="delete" color="dark" text-color="white" />
                <span class="q-ml-sm">{{textTemplate[12]}}</span>
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat :label="textTemplate[13]" color="dark" v-close-popup />
                <q-btn flat :label="textTemplate[14]" color="dark" @click="deleteWorkout" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>
      </div>

        <div class="row q-pa-xs shadow-1">
            <div class="col-2 text-center">
                <div class='text-subtitle1'>{{textTemplate[15]}}</div>
                <p class="text-subtitle2">{{ show_currentSet }}</p>
            </div>

            <div class="col-2 text-center">
                <div class='text-subtitle1'>{{textTemplate[16]}}</div>
                <p class="text-subtitle2">{{ maxSet }}</p>
            </div>

            <!-- THE TRACKING BUTTONG -->
            <div class="col-8" >
              <!-- V-IF -->
              <div class="row"
                  v-bind:class="{track: isTrack}"
                  v-if="isTrack"
              >
                <!-- COL: TRACK -->
                <div class="col-8 text-center"  >
                  <q-btn
                    color="positive"
                    label="+"
                    rounded
                    dense
                    size="xl"
                    style="width:100%; height: 100%"
                    :ripple="{ color: 'red'}"
                    @click="incWorkout(addMin)"
                  />
                  <br>
                  <span class="text-caption text-left text-weight-thin">
                    {{textTemplate[17]}}:
                  </span>
                  <span class="text-caption">
                      {{currentSet}}/{{maxSet}}
                  </span>
                </div>

                    <!-- COL: QUICK SET / RM -->
                <div class="col-4 text-center" >
                  <q-btn
                    color="positive"
                    rounded
                    dense
                    style="width:35px"
                    @click="incWorkout(addMax)"
                    :label="`+${addMax}`"
                  />
                  <br>
                  <q-btn
                    color="negative"
                    rounded
                    dense
                    style="width:35px"
                    @click="incWorkout(-addMax)"
                    :label="`-${addMax}`"
                  />

                </div>
              </div>
              <!-- V-ELSE -->
              <div class="text-center"
              v-else
              >
                <q-btn
                  :label="textTemplate[18]"
                  color="info"
                  rounded
                  dense
                  size="xl"
                  style="width:100%; height: 100%"
                  :ripple="{ color: 'red'}"
                  @click="resetWorkout"
                />
              </div>

            </div>
            <!-- ENDE: THE TRACKING BUTTONG -->
        </div>
    </div>
</template>

<script>
/* eslint-disable vue/no-side-effects-in-computed-properties */
import LOG from '../helper/my_log'
import textTemplate from '../helper/textTemplate'
export default {
  props: ['workout', 'ind', 'editWorkout'],
  data () {
    return {
      label: this.workout.label,
      currentSet: this.workout.currentSet,
      maxSet: this.workout.maxSet,
      addMin: this.workout.addMin,
      addMax: this.workout.addMax,
      isTrack: true,
      isSuccess: false,
      editLabel: false,
      confirm: false,
      textTemplate: textTemplate,
      firstStart: true
    }
  },

  computed: {
    show_currentSet () {
      if (this.currentSet < 0) {
        this.currentSet = 0
      }
      if (this.currentSet >= this.maxSet) {
        this.currentSet = 0
        this.isTrack = false
        this.isSuccess = true
        this.$store.dispatch('saveDBLocal', { storage: 'workouts', data: { workout: this.label, repeat: this.maxSet } })
      }
      if (this.firstStart) {
        this.firstStart = false
      } else {
        this.$store.dispatch('updateWorkout', { 'index': this.ind, 'key': 'currentSet', 'value': this.currentSet })
      }
      return this.currentSet
    }
  },
  methods: {
    resetWorkout () {
      this.isTrack = true
      this.isSuccess = false
    },
    incWorkout (value) {
      this.currentSet = this.currentSet + value
    },

    deleteWorkout () {
      this.$emit('deleteWorkout', this.ind)
    },
    toggleEditLabel () {
      this.editLabel = !this.editLabel
    },
    EndInput (e) {
      this.label = e.target.innerText
      this.editLabel = false
      this.$store.dispatch('updateWorkout', { 'index': this.ind, 'key': 'label', 'value': this.label })
    },
    move_up ({ reset }) {
      LOG('up')
      reset()
    },
    move_down ({ reset }) {
      LOG('down')
      reset()
    }
  }
}
</script>

<style scoped>
  .editable {
    background-color: lightgoldenrodyellow
  }
</style>

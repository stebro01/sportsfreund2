import Dexie from 'dexie'

export const labelLocalDB = 'sportsfreund'
export const labelWorkouts = 'workouts'
export const labelSettings = 'settings'

// DB FUNCTIONS
export async function openDB () {
  return new Promise((resolve, reject) => {
    var db = new Dexie(labelLocalDB)
    db.version(1).stores({
      workouts: '++id, workout, repeat, date',
      settings: '++id, settings, date'
    })
    resolve(db)
  })
}

export async function loadDB (storage) {
  return new Promise((resolve, reject) => {
    openDB()
      .then(db => {
        db.open()
          .then(db => {
            var res = []
            db[storage].each((cc) => {
              res.push(cc)
            }).then(() => resolve(res))
          }).catch((err) => reject(err))
      }).catch((err) => reject(err))
  })
}

export async function saveDB (storage, data, mode) {
  // store the workouts
  openDB()
    .then(db => {
      switch (mode) {
        case 'update':
          db[storage].count().then((res) => {
            if (res === 0) {
              db[storage].put(data)
            } else {
              db.table(storage).update(0, data)
            }
          })
          break
        default:
          db[storage].put(data)
          break
      }
    })
}

export async function clearDB () {
  var db = new Dexie(labelLocalDB)
  db.delete()
}

export function makeDate () {
  var today = new Date()
  var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
  var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds()
  var dateTime = date + ' ' + time
  return dateTime
}

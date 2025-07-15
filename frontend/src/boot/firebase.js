import { boot } from 'quasar/wrappers'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'demo',
  authDomain: 'demo.firebaseapp.com',
  projectId: 'demo',
  storageBucket: 'demo.appspot.com',
  messagingSenderId: '000000000000',
  appId: 'demo'
}

const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

export default boot(({ app }) => {
  app.config.globalProperties.$db = db
})

export { db }

import state from '../store/state'
import firebase from 'firebase/app'
import 'firebase/auth'

export const firebaseConfig = {
  apiKey: 'AIzaSyCVY6HsjrwJlAwanpp85pD-X66RFD5Mjc0',
  authDomain: 'sportsfreund-c3018.firebaseapp.com',
  databaseURL: 'https://sportsfreund-c3018.firebaseio.com',
  projectId: 'sportsfreund-c3018',
  storageBucket: 'sportsfreund-c3018.appspot.com',
  messagingSenderId: '65851537030',
  appId: '1:65851537030:web:c305faea76d7ccb86a0307',
  measurementId: 'G-L40B6M98TC'
}

export function userLogin (payload) {
  state.user.push(payload)
}

export function userLogout () {
  state.user.pop()
  firebase.auth().signOut()
}

export function checkAuth () {
  if (state.user.length > 0) {
    return true
  } else {
    return false
  }
}

export function userName () {
  if (checkAuth()) {
    return state.user[0].user.email
  } else {
    return ' '
  }
}

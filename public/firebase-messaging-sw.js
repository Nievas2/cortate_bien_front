importScripts(
  "https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js"
)
importScripts(
  "https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js"
)

const firebaseConfig = {
  apiKey: "AIzaSyAmtjoBetgu4amRmN6-j7nu69PGudeUYMk",
  authDomain: "cortate-bien-4e07a.firebaseapp.com",
  projectId: "cortate-bien-4e07a",
  storageBucket: "cortate-bien-4e07a.firebasestorage.app",
  messagingSenderId: "1086710735374",
  appId: "1:1086710735374:web:adcd78933f9f012455525f",
  measurementId: "G-FHWBWLSV5K",
}

const app = firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging(app)

messaging.onBackgroundMessage((payload) => {
  // previo a mostrar notificación
  const notificationTitle = payload.notification.title
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo192.png",
  }

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  )
})

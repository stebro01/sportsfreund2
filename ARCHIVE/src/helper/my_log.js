// DIESE FUNKTION SOLL DIE STANDARD LOGGING FUNKTION WERDEN

export default function LOG (...arg) {
  if (process.env.DEV) {
    console.log(arg)
  }
}

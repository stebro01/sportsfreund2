

export default function () {
  return {
    ENV: {
      APP_URL: 'http://localhost:3000',
      APP_VERSION: 'v202308',
      APP_NAME: 'Sportfreunde 2.0',
    },
    SETTINGS: {
      audio_playback: true,
      quick_timer_start_value: 20, // in seconds
    },
    essentialLinks: [
      { titel: 'Home', caption: 'zurück', icon: 'home', route: 'Index' },
      { seperator: true },
      { titel: 'Über', caption: 'about', icon: 'info', route: 'About' },
      { titel: 'ChangeLog', caption: 'changelog', icon: 'info', route: 'ChangeLog' },
      { titel: 'Impressum', caption: '', icon: 'gavel', route: 'Impressum' },

    ]
  }
}
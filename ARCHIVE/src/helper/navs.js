import textTemplate from './textTemplate'

const Navs = [
  {
    label: textTemplate[2],
    icon: 'apps',
    to: '/'
  },
  {
    label: textTemplate[5],
    icon: 'favorite',
    to: '/workouts'
  },
  {
    label: textTemplate[3],
    icon: 'settings',
    to: '/settings'
  },
  {
    label: textTemplate[4],
    icon: 'face',
    to: '/login'
  },
  {
    label: textTemplate[38],
    icon: 'trending_up',
    to: '/statistics'
  },
  {
    label: textTemplate[37],
    icon: 'info',
    to: '/about'
  }
]

export default Navs

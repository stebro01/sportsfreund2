
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'Index', component: () => import('pages/IndexPage.vue') },
      { path: 'about', name: 'About', component: () => import('pages/AboutPage.vue') },
      { path: 'changelog', name: 'ChangeLog', component: () => import('pages/ChangeLogPage.vue') },
      { path: 'impressum', name: 'Impressum', component: () => import('pages/ImpressumPage.vue') },

    ]
  },

  // Timer
  {
    path: '/timer',
    name: 'Timer',
    component: () => import('src/layouts/TimerLayout.vue'),
    children: [
      { path: 'timer', name: 'QuickTimer', components: { 'timer': () => import('pages/Timer/QuickTimer.vue') } },
      { path: 'program', name: 'ProgramTimer', components: { 'timer': () => import('pages/Timer/ProgrammTimer.vue') } },
      { path: 'friends', name: 'InviteFriends', components: { 'timer': () => import('pages/Timer/InviteFriends.vue') } }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

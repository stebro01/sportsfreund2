
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

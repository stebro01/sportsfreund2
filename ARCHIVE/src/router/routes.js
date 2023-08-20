
const routes = [
  {
    path: '/',
    component: () => import('layouts/PageLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageStart.vue') },
      { path: '/workouts', component: () => import('pages/PageMain.vue') },
      { path: '/settings', component: () => import('pages/PageSettings.vue') },
      { path: '/login', component: () => import('pages/PageLogin.vue') },
      { path: '/about', component: () => import('pages/PageAbout.vue') },
      { path: '/statistics', component: () => import('pages/PageStats.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes

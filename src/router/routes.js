const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DocumentListPage.vue'), name: 'index' },
      { path: '/document/:id', component: () => import('pages/DocumentPage.vue'), name: 'document' }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes

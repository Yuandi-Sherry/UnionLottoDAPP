import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/components/MainPage'
import BetPage from '@/components/BetPage'
import ResultPage from '@/components/ResultPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainPage',
      component: MainPage
    },
    {
      path: '/bet',
      name: 'BetPage',
      component: BetPage
    },
    {
      path: '/result',
      name: 'ResultPage',
      component: ResultPage
    }
  ]
})

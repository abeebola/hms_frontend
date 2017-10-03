import Vue from 'vue'
import Router from 'vue-router'
import Associations from '@/components/Associations'
import Home from '@/components/Home'
import Member from '@/components/Member'
import Members from '@/components/Members'
import Settings from '@/components/Settings'
import PrintMember from '@/components/print/PrintPerson'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/associations',
      name: 'Associations',
      component: Associations
    },
    {
      path: '/members/:id',
      name: 'Member',
      component: Member
    },
    {
      path: '/members',
      name: 'Members',
      component: Members
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
  ]
})

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        showHeader: true,
        showModal: false,
        showSideMenu: true,
        sideMenuExpanded: false,
        pageCreated: false,
        uid: null
    },
    getters: {
        isLoggedIn(state){
            return state.uid
        },
        modalOpen(state){
            return state.showModal
        },
        pageCreated(state){
            return state.pageCreated
        },
        showHeader(state){
            return state.showHeader
        },
        sideMenuExpanded(state){
            return state.sideMenuExpanded
        },
        sideMenuVisible(state){
            return state.showSideMenu
        }
    },
    mutations: {
        burn(state){
            localStorage.removeItem('laa_uid')
            state.uid = null
            return window.location.reload()
        },
        collapseSideMenu(state){
            state.sideMenuExpanded = false
        },
        hideHeader(state){
            state.showHeader = false
        },
        hideModal(state){
            state.showModal = false
        },
        hideSideMenu(state){
            state.showSideMenu = false
        },
        pageCreated(state){
            state.pageCreated = true
        },
        setUid(state, uid){
            state.uid = uid
        },
        showModal(state){
            state.showModal = true
        },
        showHeader(state){
            state.showHeader = true
        },
        showSideMenu(state){
            state.showSideMenu = true
        },
        toggleSideMenu(state){
            state.sideMenuExpanded = ! state.sideMenuExpanded
        }
    }
})
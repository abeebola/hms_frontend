<template>
    <div>
        <transition enter-active-class="fade-in" leave-active-class="fade-out">
            <signin v-if="! isLoggedIn"></signin>
        </transition>
        <transition enter-active-class="fade-in" leave-active-class="fade-out">
            <dashboard v-if="isLoggedIn"></dashboard>
        </transition>
    </div>
</template>
<script>
import assocs from './../assets/assoc'
import Dashboard from './home/Dashboard'
import Signin from './home/Signin'
import 'whatwg-fetch'
import Qs from 'qs'
export default {
    beforeMount(){
        this.header = document.getElementById('site-header')
    },
    beforeRouteUpdate(){
        console.log('updating route..')
    },
    components: {
        Dashboard,
        Signin
    },
    data(){
        return {
            header: null,
        }
    }

}
</script>



<template>
    <div class="mw1200 sp15 pdt15">
        <transition enter-active-class="fade-in" leave-active-class="fade-out">
            <div class="loader" v-if=" ! dataLoaded">
                <span class="spinner s bdblue"></span>
                <span>Getting information...</span>
            </div>
            <div v-else class="mw600">
                <form action="/profile/" class="form" @submit.prevent.stop="update()">
                    <h3>Profile</h3>
                    <hr>
                        <div class="row">
                            <div class="col-sm-6 form-group">
                                <label for="fname" class="sr-only">First name</label>
                                <input type="text" name="fname" class="form-control" placeholder="First name" v-model="profileData.fname" required>
                            </div>
                            <div class="col-sm-6 form-group">
                                <label for="lname" class="sr-only">Last name</label>
                                <input type="text" name="lname" class="form-control" placeholder="Last name" v-model="profileData.lname" required>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6 form-group">
                                <label for="username" class="sr-only">Username</label>
                                <input type="text" name="username" class="form-control" placeholder="Username" v-model="profileData.username" required>
                            </div>
                            <div class="col-sm-6 form-group">
                                <label for="email" class="sr-only">Email address</label>
                                <input type="email" name="email" class="form-control" placeholder="E-mail address" v-model="profileData.email">
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6 form-group">
                                <label for="phone" class="sr-only">Phone number</label>
                                <input type="tel" name="phone" class="form-control" placeholder="Phone number" v-model="profileData.phone">
                            </div>
                        </div>
                    <h5>Change password</h5>
                    <hr>
                        <div class="row">
                            <div class="col-sm-6 form-group">
                                <label for="opassword" class="sr-only">Old password</label>
                                <input type="password" name="opassword" class="form-control" placeholder="Old password" v-model="profileData.opassword">
                            </div>
                            <div class="col-sm-6 form-group">
                                <label for="npassword" class="sr-only">New password</label>
                                <input type="password" name="npassword" class="form-control" placeholder="New password" v-model="profileData.npassword">
                            </div>
                        </div>
                    <div class="form-group">
                        <button class="btn bblue form-control" :disabled="btnDisabled">
                            <span class="txt" v-if="!showLoader">Update profile</span>
                            <span class="spinner" v-else></span>
                        </button>
                    </div>
                </form>
            </div>
        </transition>
    </div>
</template>

<script>
import 'whatwg-fetch'
import Qs from 'qs'
export default {
    created() {
        fetch(`${this.BASE_URL}/profile?uid=${this.isLoggedIn}`)
            .then(res => this.handleResponse(res))
            .then(res => {
                console.log(res)
                this.loadUserInfo(res)
                this.person = res;
                this.dataLoaded = true;
            }).catch(err => {
                console.log(err)
                if (!err.body)
                    // Alert error.
                    return this.genericErrorAlert()

                err.body.then(body => {
                    alert(body)
                })
            })
    },
    data() {
        return {
            btnDisabled: false,
            dataLoaded: false,
            offset: 0,
            profileData: {
                fname: '',
                lname: '',
                username: '',
                email: '',
                phone: '',
                opassword: '',
                npassword: '',
            },
            showLoader: false,
        }
    },
    methods: {
        loadUserInfo(info){
            if ( ! info )
                return
            Object.keys(info).map(key => {
                if (this.profileData[key] !== undefined)
                    this.profileData[key] = info[key]
            })
        },
        update(){
            let profileData = this.profileData
            // Append uid as form param
            profileData.uid = this.isLoggedIn
            const opts = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: Qs.stringify(profileData),
                mode: 'cors'
            }

            this.showLoader = true;
            fetch(`${this.BASE_URL}/profile`, opts)
            .then(res => this.handleResponse(res))
            .then(res => {
                console.log(res)
                this.loadUserInfo(res)
                this.person = res;
                this.showLoader = false;                
            }).catch(err => {
                console.log(err)
                this.showLoader = false; 
                if (!err.body)
                    // Alert error.
                    return this.genericErrorAlert()

                err.body.then(body => {
                    alert(body)
                })
            })
        }
    },
    mounted() {
        // console.log(this.members);
    }
}
</script>

<style scoped>
.loader {
    margin-top: 30px;
}
.form button { max-width: 150px;}
</style>



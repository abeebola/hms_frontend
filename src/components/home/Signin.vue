<template>
    <div id="fb">
        <div class="s-box">
            <h3 class="text-center">Log in</h3><br>
            <form action="/login" method="post" class="form" @submit.prevent="signin()">
                <div class="form-group">
                    <label for="username" class="sr-only">
                        Username
                    </label>
                    <input type="text" name="username" placeholder="Username" class="form-control" v-model="login.username">
                </div>
                <div class="form-group">
                    <label for="password" class="sr-only">
                        Password
                    </label>
                    <input type="password" name="password" placeholder="Password" class="form-control" v-model="login.password">
                </div>
                <button class="form-control btn bblue" :disabled="btnDisabled">
                    <span class="txt" v-if="!showLoader">Log in</span>
                    <span class="spinner" v-else></span>
                </button>
            </form>
            <transition enter-active-class="fade-in" leave-active-class="fade-out">
                <span class="error" v-show="errorMsg">
                    {{errorMsg}}
                </span>
            </transition>
        </div>
    </div>
</template>

<script>
import 'whatwg-fetch'
import Qs from 'qs'
export default {
    created(){
        console.log('created')
        console.log(this.$store.getters.isLoggedIn)
        this.$store.commit('hideHeader')
        if (this.isLoggedIn)
            return window.location.reload()
    },
    data() {
        return {
            btnDisabled: false,
            errorMsg: '',
            login: {
                username: '',
                password: ''
            },
            showLoader: false
        }
    },
    methods: {
        setError(msg){
            this.errorMsg = msg
            setTimeout(() => {
                this.errorMsg = ''
            }, 1500);
        },
        signin() {
            if (this.login.username == "")
                return this.setError('Please enter your username')
            if (this.login.password.length < 3)
                return this.setError('Please enter a valid password')

            this.showLoader = true;

            const opts = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: Qs.stringify(this.login),
                mode: 'cors'
            }

            fetch(`${this.BASE_URL}/auth/login`, opts)
                .then(res => this.handleResponse(res))
                .then(res => {
                    this.showLoader = false
                    if (res.success == 1) {
                        localStorage.setItem('laa_uid', res.uid)
                        return window.location.reload()
                    }
                    return this.setError(res.msg)
                }).catch(err => {
                    console.log(err)
                    this.showLoader = false
                    if (!err.body)
                        // Alert error.
                        return this.genericErrorAlert()

                    err.body.then(body => {
                        this.setError(body)
                    })
                })
        }
    }
}
</script>
<style scoped>
.s-box {
    width: 85%;
    max-width: 350px;
    margin: 150px auto 0;
}

.s-box>h3 {
    color: #fff;
}

.s-box input {
    background-color: rgba(33, 12, 11, 0.23);
    border-color: rgba(33, 12, 11, 0.3);
    color: #fff;
}

.s-box input:focus {
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px #FF9800;
}

 ::-webkit-input-placeholder {
    color: #d6d6d6;
}

 :-moz-placeholder {
    color: #d6d6d6;
}

.error {
    display: block;
    margin-top: 20px;
    text-align: center;
    /* padding: 10px; */
    background-color: rgba(0, 0, 0, 0.66);
    color: #FF9800;
    border-radius: 5px;
    font-size: 85%;
    line-height: 30px;
}
/* .error > span {
    line-height: 30px;
} */
</style>
<style scoped>
#fb {
    display: flex;
    background: url(/static/img/nebula_b.jpg) center center no-repeat;
    background-size: cover;
    min-height: 100vh;
}
</style>




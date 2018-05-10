<template>
    <div class="mw1200 sp15 pdt15">
        <form id="mform" action="/register" class="form" method="post">
            <h3 class="text-center">
                Member Registration Form
            </h3>
            <transition enter-active-class="fade-in" leave-active-class="fade-out">
                <p v-show="err_msg !== ''" class="text-center pdt10">
                    <span class="alert alert-danger">{{errorMsg}}</span>
                </p>
            </transition>
            <hr>
            <div class="row">
                <div class="col-sm-5 img-pl">
                    <div class="img-c" :style="{height: imgThumbnail.height + 'px', 
                                    width: imgThumbnail.width + 'px'}">
                        <span :style="(() => { if (!showThumbnail) return 'opacity: 1;'})()" @click="selectImage">Click to capture or change image</span>
                        <img :src="imgUrl" alt="" v-show="showThumbnail">
                    </div>
                </div>
                <div class="col-sm-7 us-n">
                    <div class="form-group">
                        <label for="fname" class="sr-only">
                            First name
                        </label>
                        <input type="text" name="fname" class="form-control" placeholder="First name" v-model="userData.fname">
                    </div>
                    <div class="form-group">
                        <label for="mname" class="sr-only">
                            Middle name
                        </label>
                        <input type="text" name="mname" class="form-control" placeholder="Middle name" v-model="userData.mname">
                    </div>
                    <div class="form-group">
                        <label for="lname" class="sr-only">
                            Last name
                        </label>
                        <input type="text" name="lname" class="form-control" placeholder="Last name" v-model="userData.lname">
                    </div>
                    <div class="form-group">
                        <label for="phone" class="sr-only">
                            Phone number
                        </label>
                        <input type="tel" name="phone" class="form-control" placeholder="Phone number" v-model="userData.phone">
                    </div>
                </div>
            </div>
            <!-- row -->
            <hr>
            <div class="row">
                <div class="form-group col-sm-4">
                    <label for="sex">
                        Sex
                    </label>
                    <select name="sex" v-model="userData.sex" class="form-control">
                        <option value="0">Select..</option>
                        <option value="m">Male</option>
                        <option value="f">Female</option>
                    </select>
                </div>
                <div class="form-group col-sm-4">
                    <label for="dob">
                        Date of birth
                    </label>
                    <div class='input-group' id='datetimepicker1'>
                        <input name="dob" type='text' class="dash-date2 form-control" autocomplete=false :value="userData.dob" @keydown="validateDate" @keyup="formatDate" maxlength="10" placeholder="01/12/1900" />
                        <span class="input-group-addon pikaday-trigger">
                            <span class="fa fa-calendar"></span>
                        </span>
                    </div>
                </div>
                <div class="form-group col-sm-4">
                    <label for="status">
                        Marital status
                    </label>
                    <select name="status" v-model="userData.status" class="form-control">
                        <option value="0">Select..</option>
                        <option value="s">Single</option>
                        <option value="m">Married</option>
                    </select>
                </div>
                <div class="form-group col-sm-8">
                    <label for="address" class="sr-only">
                        Address
                    </label>
                    <textarea name="address" id="" rows="4" class="form-control" placeholder="Address" v-model="userData.address"></textarea>
                </div>
                <div class="col-sm-4">
                    <div class="form-group">
                        <label for="status" class="sr-only">
                            Marital status
                        </label>
                        <select name="status" v-model="userData.association" class="form-control">
                            <option value="0">Select association</option>
                            <template>
                                <option v-for="assoc in sortedAssocs" :key="assoc.id" :value="assoc.id">{{assoc.name}}</option>
                            </template>
                        </select>
                    </div>
                    <div class="form-group">
                        <button class="form-control btn bred" type="button" :disabled="btnDisabled" @click="save()">
                            <span class="txt" v-if="!showLoader">Save</span>
                            <span class="spinner" v-else></span>
                        </button>
                    </div>
                </div>
            </div>
        </form>
        <transition enter-active-class="fade-in" leave-active-class="fade-out">
            <div class="modal" v-if="modalOpen()" @click.stop.prevent="hideModal">
                <div class="modal-content">
                    <header>
                        <h3 class="text-center">
                            Capture image
                        </h3>
                    </header>
                    <hr>
                    <div class="camera">
                        <video id="video" autoplay="true">Video stream not available.</video>
                        <span>
                            <button id="startbutton" class="btn bred" @click.stop="takePicture">
                                <i class="fa fa-camera"></i> Take photo</button>
                        </span>
                    </div>
                    <canvas id="canvas"></canvas>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import 'whatwg-fetch'
import Qs from 'qs'
export default {
    computed: {
        btnDisabled() {
            return this.showLoader
        },
        imgThumbnail() {
            return {
                height: this.namesDivHeight,
                width: this.namesDivHeight,
            }
        },
        showThumbnail() {
            if (this.imgUrl !== '')
                return true
            return false
        },
        sortedAssocs() {
            return this.assocs.sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase())
                    return -1
                if (a.name.toLowerCase() > b.name.toLowerCase())
                    return 1
                return 0
            })
        }
    },
    // beforeUpdate(){
    //   console.log('before...')
    // },
    created() {
        fetch(`${this.BASE_URL}/associations/all`)
            .then(res => this.handleResponse(res))
            .then(res => {
                this.assocs = res;
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
            canvas: null,
            err_msg: '',
            assocs: [],
            errorMsg: '',
            imgData: '',
            imgUrl: '',
            mform: null,
            namesDivHeight: 0,
            // oUserData: [],
            userData: {
                fname: '',
                lname: '',
                mname: '',
                address: '',
                association: 0,
                sex: 0,
                dob: '',
                status: 0
            },
            showLoader: false,
            video: null,
            videoSrcObject: null
        }
    },
    methods: {
        clearPhoto() {
            let context = this.canvas.getContext('2d');
            context.fillStyle = "#AAA";
            context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            let data = this.canvas.toDataURL('image/png');
            this.imgUrl = data
        },
        formatDate(e) {
            const oldVal = this.userData.dob
            let val = e.target.value,
                len = val.length
            if (len == 2 || len == 5)
                val += '/'
            this.userData.dob = val
        },
        resetForm(){
          this.userData = {
                fname: '',
                lname: '',
                mname: '',
                address: '',
                association: 0,
                sex: 0,
                dob: '',
                status: 0
            }
          this.imgUrl = ''
        },
        save() {
            // Reset any previous errors
            this.err_msg = ''
            this.showLoader = true
            this.validateData()
            if (this.err_msg !== '') {
                this.showLoader = false
                return this.showErrors()
            }

            let userData = this.userData
            userData.img_url = this.imgUrl

            const opts = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: Qs.stringify(userData),
                mode: 'cors'
            }

            fetch(`${this.BASE_URL}/members/add`, opts)
                .then(res => {
                    return this.handleResponse(res)
                }).then(res => {
                    this.showLoader = false
                    if (res.success == 1){
                        alert('Added successfully.')
                        return this.resetForm()
                        return this.$router.replace({ name: 'Home' })
                    }
                    alert(res.data)
                }).catch(err => {
                    this.showLoader = false
                    if (!err.body)
                        // Alert error.
                        return this.genericErrorAlert()

                    err.body.then(body => {
                        alert(body)
                    })
                })
        },
        selectImage() {
            this.showModal()
            this.canvas = document.getElementById('canvas')
            this.video = document.getElementById('video')
            this.startVideo()
        },
        showErrors() {
            this.errorMsg = this.err_msg
            setTimeout(() => {
                this.err_msg = ''
            }, 3000);
        },
        startVideo() {
            console.log('starting video..')
            navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 400 },
                    height: { ideal: 400 }
                }, audio: false
            })
                .then(stream => {
                    window.stream = stream
                    this.video.srcObject = stream; // stream;
                })
                .catch(function(err) {
                    console.log("An error occured! " + err);
                });
        },
        takePicture(e) {
            console.log('Taking snapshot..')
            const width = this.video.clientWidth
            const height = this.video.clientHeight
            let context = this.canvas.getContext('2d');
            if (width && height) {
                this.canvas.width = width;
                this.canvas.height = height;
                context.drawImage(this.video, 0, 0, width, height);
                var data = this.canvas.toDataURL('image/png');
                this.imgUrl = data
            } else {
                this.clearPhoto();
            }

            this.hideModal()
            this.video.pause();
        },
        validateData() {
            // Validate first name
            if (this.userData.fname == '')
                return this.err_msg = "First name is required."
            if (this.userData.fname.length < 2)
                return this.err_msg = "First name can not be less than 2 characters long."
            // Validate last name
            if (this.userData.lname == '')
                return this.err_msg = "Last name is required."
            if (this.userData.lname.length < 2)
                return this.err_msg = "Last name can not be less than 2 characters long."
            // Validate phone number
            if (this.userData.phone == '')
                return this.err_msg = "Phone number is required."
            // Validate address
            if (this.userData.address.length < 6)
                return this.err_msg = "Please enter a valid address."
            // Validate Sex
            if (!this.userData.sex)
                return this.err_msg = "Please provide gender information."
            // Validate DoB
            if (!this.userData.dob)
                return this.err_msg = "Please provide birth date."
            // Validate marital status
            if (!this.userData.status)
                return this.err_msg = "Please provide marital status."
            // Validate association
            if (!this.userData.association)
                return this.err_msg = "Please select an association."
            // Validate image selection
            if (!this.imgUrl)
                return this.err_msg = "Please select a photo."
        },
        validateDate(e) {
            // e.preventDefault()
            const oldVal = this.userData.dob
            let key = e.key,
                val = parseInt(key),
                len = oldVal.length,
                match = key.match(/[0-9]|Backspace|F5/)

            if (!match)
                return e.preventDefault()

            if (len > 9)
                return
            if (len == 0) {
                if (val > 3)
                    return e.preventDefault()
            }
            if (len == 1) {
                if (oldVal == 3 && val > 1)
                    return e.preventDefault()
            }
            if (len == 3) {
                if (val > 1)
                    return e.preventDefault()
            }
            if (len == 4) {
                const lastDigit = oldVal.slice(-1)
                if (lastDigit == 1 && val > 2)
                    return e.preventDefault()
            }
            if (len == 6) {
                if (val < 1 || val > 2)
                    return e.preventDefault()
            }
            if (len == 7) {
                const lastDigit = oldVal.slice(-1)
                if (lastDigit == 1 && val < 8)
                    return e.preventDefault()
            }
        }
    },
    mounted() {
        this.namesDivHeight = document.querySelector('.us-n').clientHeight - 15
    },
    updated() {
        this.canvas = document.getElementById('canvas')
        this.video = document.getElementById('video')
    },
}
</script>
<style scoped>
#datetimepicker1 {
    cursor: pointer
}

.form {
    max-width: 600px;
    margin: 0 auto;
}

.img-pl {
    cursor: pointer;
}

.img-c {
    background-color: #e0e0e0;
    position: relative;
    overflow: hidden;
    margin: 0 auto 20px;
}

.img-c>img {
    max-width: 100%;
    height: auto;
}

.img-c>span {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    padding: 30px 10px;
    text-align: center;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.59);
    opacity: 0;
    transition: opacity .3s ease-in;
}

.img-c:hover>span {
    opacity: 1;
}

.camera {
    background-color: #9E9E9E;
    width: 400px;
    max-width: 100%;
    height: auto;
    margin: 0 auto;
    display: block;
    position: relative;
}

.camera>span {
    width: 100%;
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.62);
    padding: 10px 0 2px;
}

#video {
    max-width: 100%;
}

#canvas {
    display: none;
}

@media screen and (min-width: 769px) {
    .us-n {
        float: left
    }
    .img-pl,
    .img-c {
        float: right
    }
}
</style>
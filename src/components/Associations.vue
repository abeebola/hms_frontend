<template>
    <div class="mw1200 sp15 pdt15">
        <transition enter-active-class="fade-in" leave-active-class="fade-out">
            <div class="modal flex" v-if="! dataLoaded">
                <div class="dialog">
                    <span class="spinner s bdred"></span>
                    <span>Loading...</span>
                </div>
            </div>
            <div v-else>
                <p>There are {{assocs.length}} association(s).
                    <Button @click="addNew">Add new</Button>
                </p>
                <div class="data-table">
                    <transition enter-active-class="fade-in" leave-active-class="fade-out">
                        <div v-if="showAdd">
                            <transition enter-active-class="slide-up-in" leave-active-class="slide-up-out">
                                <p v-show="err_msg !== ''" class="pdt10">
                                    <span class="alert alert-danger">{{errorMsg}}</span>
                                </p>
                            </transition>
                            <form action="/associations/add" method="post" class="form col-sm-6" @submit.prevent.stop="addAssociation">
                                <div class="row">
                                    <div class="col-sm-8 form-group">
                                        <div class="row">
                                            <label for="assoc_name" class="sr-only">Association name</label>
                                            <input type="text" class="form-control" placeholder="Asociation name" v-model="assocData.name">
                                        </div>
                                    </div>
                                    <div class="col-sm-3 form-group">
                                        <div class="row">
                                            <button class="btn bred form-control">
                                                <span class="txt" v-if="!showLoader">Add</span>
                                                <span class="spinner" v-else></span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </transition>
                </div>
                <div v-if="assocs.length > 0">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th>Association</th>
                                <th>No of Members</th>
                            </tr>
                        </thead>
                        <tbody class="">
                            <tr v-for="assoc in assocs" :key="assoc.name">
                                <td>{{assoc.name}}</td>
                                <td>{{assoc.member_count}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import 'whatwg-fetch'
import Qs from 'qs'
export default {
    created() {
        this.updateAssociations()
    },
    data() {
        return {
            assocData: {
                name: ''
            },
            dataLoaded: false,
            err_msg: '',
            errorMsg: '',
            assocs: [],
            offset: 0,
            showAdd: false,
            showLoader: false,
        }
    },
    methods: {
        addAssociation(e) {
            if (this.assocData.name == '')
                return (() => {
                    this.errorMsg = this.err_msg = "Enter association name"
                    setTimeout(() => {
                        this.err_msg = ""
                    }, 2000)
                })()

            const opts = {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: Qs.stringify(this.assocData),
                mode: 'cors'
            }

            this.showLoader = true

            fetch(`${this.BASE_URL}/associations/add`, opts)
                .then(res => this.handleResponse(res))
                .then(res => {
                    this.showLoader = false
                    if (res.success == 1) {
                        this.assocs.push({
                            id: res.id,
                            name: this.assocData.name,
                            member_count: 0
                        })
                        this.assocData.name = ''
                        return this.updateAssociations()
                    }
                    return alert(res.msg)
                }).catch(err => {
                    console.log(err)
                    this.showLoader = false
                    if (!err.body)
                        // Alert error.
                        return this.genericErrorAlert()

                    err.body.then(body => {
                        alert(body)
                    })
                })
        },
        addNew() {
            this.showAdd = true
        },
        updateAssociations() {
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
        }
    },
    mounted() {
        // console.log(this.members);
    }
}
</script>

<style scoped>
.c_loader {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.c_loader::before {
    content: '';
    display: block;
    position: fixed;
}

.c_loader::after {
    content: '';
}
</style>



<template>
    <div class="mw1200 sp15 pdt15">
        <transition enter-active-class="fade-in" leave-active-class="fade-out">
            <div class="modal flex" v-if="! dataLoaded">
                <div class="dialog">
                    <span class="spinner s bdred"></span>
                    <span>Loading...</span>
                </div>
            </div>
            <div class="data-table" v-else>
                <div v-if="person">
                    <div class="pro-t" v-if=" ! print">
                        <h2 class="text-center">Member profile</h2>
                        <hr>
                        <div class="row">
                            <div class="col-sm-6 pull-right">
                                <div class="pimg">
                                    <img :src="`${this.BASE_URL}/static/img/profile/_s/${person.img}`" alt="" class="img-responsive">
                                </div>
                                <!-- <button type="button" class="form-control btn bred mgt10" @click="printCard">Print</button> -->
                            </div>
                            <div class="col-sm-6 pull-left">
                                <table class="table fw">
                                    <tbody class="details">
                                        <tr>
                                            <td>
                                                <strong>Surname:</strong>
                                            </td>
                                            <td>{{person.lname}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>First name:</strong>
                                            </td>
                                            <td>{{person.fname}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Middle name:</strong>
                                            </td>
                                            <td>{{person.mname}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>ID No:</strong>
                                            </td>
                                            <td>A{{person.uid}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Phone no:</strong>
                                            </td>
                                            <td>{{person.phone}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Address:</strong>
                                            </td>
                                            <td>{{person.address}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Date of birth:</strong>
                                            </td>
                                            <td>{{person.dob}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Gender:</strong>
                                            </td>
                                            <td>{{person.sex == 'm' ? 'Male' : 'Female'}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Marital status:</strong>
                                            </td>
                                            <td>{{person.m_status == 'm' ? 'Married' : 'Single'}}</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <strong>Association:</strong>
                                            </td>
                                            <td>{{person.assoc_name}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <print-person :person="person"></print-person>
                    </div>
                </div>
                <div v-else>
                    <p>This user does not exist.</p>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import 'whatwg-fetch'
import Qs from 'qs'
import PrintPerson from './print/PrintPerson'
export default {

    components: {
        PrintPerson,
    },
    beforeMount() {
        this.initPrint()
    },
    beforeRouteUpdate(to, from, next) {
        if (to.name == from.name) {
            if (to.query.print !== undefined)
                this.print = true;
            else this.print = false
        }
        next()
    },

    created() {
        fetch(`${this.BASE_URL}/members/?uid=${this.$route.params.id}`)
            .then(res => this.handleResponse(res))
            .then(res => {
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
            dataLoaded: false,
            offset: 0,
            person: null,
            print: false
        }
    },
    methods: {
        exitPrint() {
            this.print = false;
            this.$store.commit('showHeader')
            this.$store.commit('showSideMenu')
        },
        initPrint() {
            if (this.$route.query.print !== undefined)
                this.print = true
            else this.print = false
        },
        printCard() {
            this.$router.push({ path: `/members/${this.$route.params.id}/`, query: { print: 'true' } })
        },
    },
}
</script>

<style scoped>
.table td {
    padding: 8px 4px;
    border: none;
}

.pro-t {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
}

.pimg>img {
    width: auto;
    max-height: 100%;
}
</style>



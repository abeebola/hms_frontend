<template>
    <div class="mw1200 sp15 pdt15">
        <transition enter-active-class="fade-in" leave-active-class="fade-out">
            <div class="modal flex" v-if="! dataLoaded">
                <div class="dialog">
                    <span class="spinner s bdblue"></span>
                    <span>Loading...</span>
                </div>
            </div>
            <div v-else>
                <div class="form-group">
                    <span style="display: inline-block;">There are {{members.length}} member(s).
                        <router-link to="/" tag="button">Add new</router-link>
                    </span>
                    <div class="sm pull-right">
                        <div class="input-group">
                            <span class="input-group-addon">
                                <i class="fa fa-search"></i>
                            </span>
                            <input type="search" class="form-control" placeholder="Search members by ID" v-model="searchTerm">
                            <span class="spinner" v-show="true"></span>
                        </div>
                    </div>
                </div>
                <div class="data-table">
                    <div v-if="searchLoading">
                        <hr>
                        <div class="loader">
                            <span class="spinner s bdblue"></span>
                            <span>Searching...</span>
                        </div>
                    </div>
                    <div v-if="cMembers.length > 0">
                        <div v-if=" ! searchLoading ">
                            <table class="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th>Full name</th>
                                        <th>Phone no</th>
                                        <th>Address</th>
                                        <th>Association</th>
                                    </tr>
                                </thead>
                                <tbody class="">
                                    <router-link v-for="member in cMembers" :key="member.fname" :to="`/members/${member.uid}`" tag="tr">
                                        <td :uid="member.uid">{{member.fname}} {{member.lname}}</td>
                                        <td>{{member.phone}}</td>
                                        <td>{{member.address}}</td>
                                        <td>{{member.assoc_name}}</td>
                                    </router-link>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div v-else-if="cMembers.length < 1 && searchResults !== null">
                        <hr>
                        <h4 class="text-center">
                            Empty result.
                        </h4>
                    </div>
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
        cMembers() {
            const sr = this.searchResults,
                mb = this.members

            return sr !== null ? sr : mb
        }
    },
    created() {
        fetch(`${this.BASE_URL}/members/all`)
            .then(res => this.handleResponse(res))
            .then(res => {
                this.members = res;
                this.dataLoaded = true;
            }).catch(err => {
                this.dataLoaded = true;
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
            members: [],
            offset: 0,
            searchLoading: false,
            searchResults: null,
            searchTerm: '',
        }
    },
    watch: {
        searchTerm() {
            if (this.searchTerm == '')
                return this.searchResults = null

            this.searchLoading = true

            fetch(`${this.BASE_URL}/members/search?id=${this.searchTerm}`)
                .then(res => this.handleResponse(res))
                .then(res => {
                    this.searchLoading = false
                    if (typeof res == 'object')
                        this.searchResults = res;
                }).catch(err => {
                    this.searchLoading = false
                    console.log(err)
                    if (!err.body)
                        // Alert error.
                        return this.genericErrorAlert()

                    err.body.then(body => {
                        alert(body)
                    })
                })
        }
    }
}
</script>

<style scoped>
tr {
    cursor: pointer;
}

.sm {
    width: 250px;
    max-width: 100%;
}

.sm .form-control {
    height: 34px;
}

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



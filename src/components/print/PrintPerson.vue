<template>
  <div>
      <div class="bg">
          <h1 class="text-center">
              <b>Harmony Ltd.</b>
          </h1>
          <h2 class="text-center">
              Identity card
          </h2>
          <div class="r">
              <div class="img-b">
                  <img :src="`${this.BASE_URL}/static/img/profile/_s/${person.img}`" alt="">
              </div>
          </div>
          <div class="d">
              <b>Name: </b> {{person.fname + ' ' + person.lname}}
          </div>
      </div>
  </div>
</template>

<script>
export default {
    beforeCreate(){
        var link = document.createElement('link')
        link.id = 'print-id'
        link.rel = "stylesheet"
        link.href = "/static/css/print-id.css"
        // document.head.appendChild(link)
        document.head.append(link)
    },
    beforeDestroy(){
        var link = document.getElementById('print-id')
        link.remove()
    },
    created(){
        // this.person = this.
    },
    data(){
        return {
            // person: null,
        }
    },
  props: [
      'person',
  ]
}
</script>
<style scoped>
/* .r {
    background-color: #0071c9;
    width: 30%;
    height: 100%;
}
.img-b {
    width: 190px;
    height: 190px;
}
.img-b > img {
    width: 100%;
    max-width: 100%;
}
.d {
    width: 70%;
    height: 100%;
}
.r, .d {
    float: left;
} */
</style>



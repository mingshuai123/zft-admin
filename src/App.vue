<template>
  <div id="app">
    <transition :name="direction"
    mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>

export default {
  name: 'App',
  data(){
    return {
      transitionName:'slide-left'
    }
  },
  created () {
    sessionStorage.setItem("routesInfo", false);
  },
  computed:{
   direction (){
    const viewDir = this.$store.state.user.viewDirection;
    let tranName = '';
    viewDir === 'left'?tranName = 'view-out':(viewDir === 'right'?tranName = 'view-oinut':tranName = 'fade');
    return tranName
   }
  },
  watch:{
    '$route':function() {
      sessionStorage.setItem('pathName',this.$route.fullPath);
      let isBack=this.$router.isBack;
      if( isBack ){
        this.transitionName = 'slide-right';
        this.$router.isBack = false;
      }else{
        this.transitionName = 'slide-left';
        this.$router.isBack = true;
      }
    }
  }
  
}
</script>
<style lang="scss">
// Variables
$AnimateHook: "animated";
$AnimateDuration: 0.8s;
 
// Mixins
 
// Base Style
.#{$AnimateHook} {
 -webkit-animation-duration: $AnimateDuration;
 animation-duration: $AnimateDuration;
 -webkit-animation-fill-mode: both;
 animation-fill-mode: both;
 
 // Modifier for infinite repetition
 &.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
 }
 
}
 
// Slide
@-webkit-keyframes slideInLeft {
 from {
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
  visibility: visible;
 }
 
 to {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
 }
 
}
 
@keyframes slideInLeft {
 from {
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
  visibility: visible;
 }
 
 to {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
 }
 
}
 
.slideInLeft {
 -webkit-animation-name: slideInLeft;
 animation-name: slideInLeft;
}
 
@-webkit-keyframes slideInRight {
 from {
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
  visibility: visible;
 }
 
 to {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
 }
 
}
 
@keyframes slideInRight {
 from {
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
  visibility: visible;
 }
 
 to {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
 }
 
}
 
.slideInRight {
 -webkit-animation-name: slideInRight;
 animation-name: slideInRight;
}
 
@-webkit-keyframes slideOutLeft {
 from {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
 }
 
 to {
  visibility: hidden;
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
 }
 
}
 
@keyframes slideOutLeft {
 from {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
 }
 
 to {
  visibility: hidden;
  -webkit-transform: translate3d(-100%, 0, 0);
  transform: translate3d(-100%, 0, 0);
 }
 
}
 
.slideOutLeft {
 -webkit-animation-name: slideOutLeft;
 animation-name: slideOutLeft;
}
 
@-webkit-keyframes slideOutRight {
 from {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
 }
 
 to {
  visibility: hidden;
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
 }
 
}
 
@keyframes slideOutRight {
 from {
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
 }
 
 to {
  visibility: hidden;
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0);
 }
 
}
 
.slideOutRight {
 -webkit-animation-name: slideOutRight;
 animation-name: slideOutRight;
}
 
@-webkit-keyframes inRight {
 0% {
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0)
 }
 
 to {
  -webkit-transform: translateZ(0);
  transform: translateZ(0)
 }
 
}
 
@keyframes inRight {
 0% {
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0)
 }
 
 to {
  -webkit-transform: translateZ(0);
  transform: translateZ(0)
 }
 
}
 
@-webkit-keyframes outLeft {
 0% {
  -webkit-transform: translateZ(0);
  transform: translateZ(0)
 }
 
 to {
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0)
 }
 
}
 
@keyframes outLeft {
 0% {
  -webkit-transform: translateZ(0);
  transform: translateZ(0)
 }
 
 to {
  -webkit-transform: translate3d(100%, 0, 0);
  transform: translate3d(100%, 0, 0)
 }
 
}

// 123123
.fade-enter-active,
.fade-leave-active {
 transition: all .2s ease;
}
 
.fade-enter,
.fade-leave-active {
 opacity: 0;
}
 
.view-in-enter-active,
.view-out-leave-active {
 position: absolute;
 top: 0;
 width: 100%;
 -webkit-animation-duration: .3s;
 animation-duration: .3s;
 -webkit-animation-fill-mode: both;
 animation-fill-mode: both;
 -webkit-backface-visibility: hidden;
 backface-visibility: hidden;
}
 
.view-in-enter-active {
 -webkit-animation-name: inRight;
 animation-name: inRight;
}
 
.view-out-leave-active {
 -webkit-animation-name: outLeft;
 animation-name: outLeft;
}
</style>


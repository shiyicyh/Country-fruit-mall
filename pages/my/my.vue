<template>
  <view>
    <text>这里是个人中心页面。</text>
    <button type="primary" plain="true" @click="testlogin()">登录</button>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        
      };
    },
    methods:{
      testlogin(){
        
      }
    }
    
  }
</script>

<style lang="scss">

</style>

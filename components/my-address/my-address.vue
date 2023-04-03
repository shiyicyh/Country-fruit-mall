<template>
  <view>
   
    <view class="address-box" @click="chooseAddress">
       <!-- 选择收货地址 -->
      <text v-if="JSON.stringify(address) === '{}'">请添加收货地址</text>
      <!-- 渲染收货信息的盒子 -->
      <view v-else>
        <view class="row1">{{addstr}}</view>
        <view class="row2">
          <text>{{address.userName}}</text>
          <text>{{address.telNumber}}</text>
        </view>
      </view>
      
      <uni-icons type="arrowright" size="16"></uni-icons>
    </view>
    
  </view>
</template>

<script>
  import { mapState,mapGetters,mapMutations, } from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {
        // 收货地址
        // address:{},
      };
    },
    computed: {
      ...mapState('m_user', ['address']),
      ...mapGetters('m_user', ['addstr']),
    },
    methods: {
      ...mapMutations('m_user', ['updateAddress']),
      // 选择收货地址
      async chooseAddress() {
        // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
        //    返回值是一个数组：第 1 项为错误对象；第 2 项为成功之后的收货地址对象
        const [err, succ] = await uni.chooseAddress().catch(err => err)
    
        // 2. 用户成功的选择了收货地址
        if (err === null && succ.errMsg === 'chooseAddress:ok') {
          this.updateAddress(succ)
        }
        // 3. 用户没有授权
          if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
            this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
          }
      },
      // 调用此方法，重新发起收货地址的授权
      async reAuth() {
        // 3.1 提示用户对地址进行授权
        const [err2, confirmResult] = await uni.showModal({
          content: '检测到您没打开地址权限，是否去设置打开？',
          confirmText: "确认",
          cancelText: "取消",
        })
      
        // 3.2 如果弹框异常，则直接退出
        if (err2) return
      
        // 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
        if (confirmResult.cancel) return uni.$showMsg('您取消了地址授权！')
      
        // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
        if (confirmResult.confirm) return uni.openSetting({
          // 3.4.1 授权结束，需要对授权的结果做进一步判断
          success: (settingResult) => {
            // 3.4.2 地址授权的值等于 true，提示用户 “授权成功”
            if (settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权”
            if (!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      },
    },
  }
</script>

<style lang="scss">
// 选择收货地址的盒子
.address-box {
  // height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  padding:17px;
  font-size: 15px;
  border-top: 2px solid #ebebeb;
}
.row2{
  font-size: 13px;
  color: #9e9e9e;
  margin-top: 5px;
}
.row2 text:nth-child(1){
  display: inline-block;
  margin-right: 5px;
}
</style>
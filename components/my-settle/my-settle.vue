<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
      <label class="radio" @click="changeAllState">
        <radio color="#00a700" :checked="isFullCheck" /><text>全选</text>
      </label>
    
      <!-- 合计区域 -->
      <view class="amount-box">
        合计:<text class="amount">￥{{checkedGoodsAmount | toPrice}}</text>
      </view>
    
      <!-- 结算按钮 -->
      <view class="btn-settle" @click="settlement()">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
  import { store } from '@/uni_modules/uni-id-pages/common/store.js'
  export default {
    name:"my-settle",
    computed: {
      // ...mapGetters('m_user', ['addstr']),
        // 1. 将 total 映射到当前组件中
            ...mapGetters('m_cart', ['checkedCount', 'total','checkedGoodsAmount']),
            // 2. 是否全选
            isFullCheck() {
              return this.total === this.checkedCount
            },
            hasLogin(){
            	return store.hasLogin
            }
      },
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器的 Id
        timer: null
      };
    },
    methods:{
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      // label 的点击事件处理函数
      changeAllState() {
        // 修改购物车中所有商品的选中状态
        // !this.isFullCheck 表示：当前全选按钮的状态取反之后，就是最新的勾选状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 点击了结算按钮
      settlement() {
        // 1. 先判断是否勾选了要结算的商品
        if (!this.checkedCount) return uni.showToast({title: '请选择要购买的商品',duration: 2000,icon:'none'})
      
        // 2. 再判断用户是否选择了收货地址
        // if (!this.addstr) return uni.showToast({title: '请选择收货地址',duration: 2000,icon:'none'})
      
        // 3. 最后判断用户是否登录了，如果没有登录，则调用 delayNavigate() 进行倒计时的导航跳转
        // if (!this.token) return uni.$showMsg('请先登录！')
        if (!this.hasLogin) return this.delayNavigate()
        
        // 4. 实现微信支付功能
          uni.navigateTo({url: '/subpkg/confirm_order/confirm_order'})
      },
      // 延迟导航到 my 页面
      delayNavigate() {
        // 把 data 中的秒数重置成 3 秒
        this.seconds = 3
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.navigateTo({
            	url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
              // 页面跳转成功之后的回调函数
               // success: () => {
               //   // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
               //   this.updateRedirectInfo({
               //     // 跳转的方式
               //     openType: 'navigateTo',
               //     // 从哪个页面跳转过去的
               //     from: '/pages/cart/cart'
               //   })
               // }
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      // 展示倒计时的提示消息
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '请先登录！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
     
    }
  }
</script>

<style lang="scss">
  .my-settle-container {
    // 底部固定定位
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 5px;
    font-size: 14px;
  
    .radio {
      display: flex;
      align-items: center;
    }
  
    .amount {
      color: #c00000;
    }
  
    .btn-settle {
      height: 50px;
      min-width: 100px;
      // background-color: #c00000;
      background-color: #078f1c;
      color: #fff;
      line-height: 50px;
      text-align: center;
      padding: 0 10px;
    }
  }
</style>
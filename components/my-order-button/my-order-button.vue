<template>
  <view class="my-order-button">
    <view class="order-button" v-if="status==3 || status==4 || status==-1" @click="orderButton(-2)">删除订单</view>
    <view class="order-button" v-if="status==0 || status==1" @click="orderButton(-1)">取消订单</view>
    <view class="order-button" v-if="status==0" @click="orderButton(1)">支付订单</view>
    <view class="order-button" v-else-if="status==2" @click="orderButton(3)">确认收货</view>
    <view class="order-button" v-else-if="status==3" @click="this.$emit('goto','comment')">去评价</view>
  </view>
</template>

<script>
  export default {
    name:"my-order-button",
    props:{
      status:{
        type:Number,
        default:0,
      },
    },
    data() {
      return {
        
      };
    },
    create(){
      console.log("按钮组件收到的状态")
      console.log(this.status)
    },
    methods:{
      orderButton(s){
        if(s==4){//去评价
          console.log("跳转评论页面")
          // uni.navigateTo({
          //   url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
          // })
        }else if(s==0){//去支付
          console.log("跳转支付页面")
        }
        else{
          this.$emit('orderButton',s)
        }
        
      },
    },
  }
</script>

<style lang="scss">
.my-order-button{
  display: flex;
  justify-content: flex-end;
  align-items: center;
  .order-button{
    padding: 6px 10px;
    margin: 5px;
    text-align: center;
    font-size: 14px;
    border: 1px solid #ebebeb;
    border-radius: 20px;
  }
}
</style>
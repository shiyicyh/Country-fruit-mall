<template>
  <view class="order-detail">
    <view class="order-status">
      <view class="status">
        <view>{{statusList[status].name}}</view>
        <view class="status-desc">{{statusList[status].desc}}</view>
      </view>
      <i class="iconfont" :class="statusList[status].icon"></i>
    </view>
    <view class="info-item" v-if="order.status > 1">
      <text>{{order.expressInfo.name}}</text>
      <text>{{order.expressInfo.ID}}</text>
    </view>
    
    <view class="order-address box">
      <view class="row1">{{order.user_address.addstr}}</view>
      <view class="row2">
        <text>{{order.user_address.userName}}</text>
        <text>{{order.user_address.telNumber}}</text>
      </view>
    </view>
    <view class="box">
      <block v-for="(goods) in goods" :key="goods.goods_id">
        <my-goods :goods="goods" :iforder="true" :imgsize="60"></my-goods>
      </block>
    </view>
    <view class="box">
      <view class="info-item">
        <text>商品总金额</text>
        <text>￥{{order.total_fee | toPrice}}</text>
      </view>
      <view class="info-item">
        <text>配送费</text>
        <text>￥0.00</text>
      </view>
      <view class="info-item">
        <text>包装费</text>
        <text>￥0.00</text>
      </view>
    </view>
    <view class="box">
      <view class="info-item">
        <text>订单编号</text>
        <text>{{order._id}}</text>
      </view>
      <view class="info-item">
        <text>下单时间</text>
        <text>{{order.create_date | timestampToTime}}</text>
      </view>
      <view class="info-item" v-if="order.pay_date">
        <text>支付时间</text>
        <text>{{order.pay_date | timestampToTime}}</text>
      </view>
      <view class="info-item" v-if="order.cancel_date">
        <text>取消时间</text>
        <text>{{order.cancel_date | timestampToTime}}</text>
      </view>
      <view class="info-item" v-if="order.deliver_date">
        <text>发货时间</text>
        <text>{{order.deliver_date | timestampToTime}}</text>
      </view>
      <view class="info-item" v-if="order.receive_date">
        <text>成交时间</text>
        <text>{{order.receive_date | timestampToTime}}</text>
      </view>
    </view>
    <view class="bottom-button">
      <my-order-button :status="order.status" @orderButton="orderOperation()" @goto="gotoPage()"></my-order-button>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.database();
  export default {
    data() {
      return {
        statusList:[
          {
            "name":'已取消',
            "desc":'订单已取消',
            "icon":'icon-yiquxiao1'
          },{
            "name":'待支付',
            "desc":'请尽快支付',
            "icon":'icon-weizhifu'
          },{
            "name":'待发货',
            "desc":'商品准备中',
            "icon":'icon-daifahuo'
          },{
            "name":'待收货',
            "desc":'商品正在配送中',
            "icon":'icon-peisongzhong'
          },{
            "name":'已完成 ',
            "desc":'期待下次为您服务',
            "icon":'icon-yiwancheng'
          },{
            "name":'已完成 ',
            "desc":'期待下次为您服务',
            "icon":'icon-yiwancheng'
          }
        ],
        order:{},
        goods:[]
      };
    },
    onShow() {
      this.order=getApp().globalData.order_detail
      this.goods=getApp().globalData.order_goods
    },
    computed:{
      status(){
        return this.order.status+1
      },
    },
    methods:{
      orderOperation(s){
        db.collection('uni-pay-orders')
        .where("_id=='"+this.order._id+"'")
        .update({status:s})
        .then(res => {
          console.log("订单状态更新成功")
        }).catch((err)=>{
      			console.log(err);
      	  })
      },
      gotoPage(){
        uni.navigateTo({
          url: '/subpkg/goods_comment/goods_comment'
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.order-detail{
  // padding-bottom: 40px;
  box-sizing: border-box;
  background-color: #ebebeb;
  width: 100vw;
  min-height: 100vh;
  padding-bottom: 40px;
  .box{
    background-color: #ffffff;
    margin: 5px 0;
  }
  .order-status{
    display: flex;
    justify-content:space-between;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    padding: 7px 5.33vw;
    background: linear-gradient(90deg, #71bf86 0%, #ffffff 100%);
    .status{
      text-align: left;
      font-size: 16px;
      color: #ffffff;
      .status-desc{
        font-size: 14px;
      }
    }
    .iconfont{
      font-size: 60px;
    }
    image{
      width: 60px;
      height: 60px;
    }
  }
  .order-address{
    width: 100%;
    box-sizing: border-box;
    padding:17px;
    font-size: 15px;
    .row2{
      font-size: 13px;
      color: #9e9e9e;
      margin-top: 5px;
    }
    .row2 text:nth-child(1){
      display: inline-block;
      margin-right: 5px;
    }
  }
  .bottom-button{
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    padding: 5px;
    background-color: #ffffff;
    z-index: 3;
  }
}
.info-item{
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  padding: 7px 10px;
  background-color: #ffffff;
}
</style>

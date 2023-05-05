<template>
  <view class="order" @tap.native.stop="gotoOrderDetail()" >
    <view class="title">
      <view>下单时间：{{order.create_date | timestampToTime}}</view>
      <view class="status">{{status}}</view>
    </view>
    <view>
      <block v-for="(goods) in orderGoods" :key="goods.goods_id">
        <my-goods :goods="goods" :iforder="true" :imgsize="60"></my-goods>
      </block>
    </view>
    <view style="text-align: right;">
      <text style="font-size: 13px;color: #9e9e9e;">共{{order.total_count}}件,合计：</text>
      <text style="font-size: 17px;color: #000000;">{{order.total_fee | toPrice}}</text>
    </view>
    <my-order-button :status="order.status" @orderButton="orderOperation()"></my-order-button>
  </view>
</template>

<script>
  const db = uniCloud.database();
  export default {
    name:"my-order",
    props:{
      order:{
        type:Object,
        default:{},
      },
    },
    data() {
      return {
        orderdate:'',
        orderGoods:[],
      };
    },
    created() {
      console.log("接收到的订单信息")
      console.log(this.order)
      this.getGoodsInfo()
    },
    computed:{
      status(){
        switch(this.order.status){
          case -1:
            return '交易取消';
            break;
          case 3:
            return '交易完成';
            break;
          default:
            return '交易中';
        }
      }
    },
    methods:{
      // 处理商品信息显示
      getGoodsInfo(){
        for(let i=0;i<this.order.buy_goods.length;i++){
          db.collection('opendb-mall-goods')
        	.where("_id=='"+this.order.buy_goods[i].good_id+"'")
          .field('goods_thumb,name,goods_price,standard')
        	.get()
        	.then((res)=>{
            console.log("订单商品信息")
            console.log(res)
            let goods=res.result.data[0]
            goods.goods_count=this.order.buy_goods[i].buynum
             
            this.orderGoods.push(goods)
            console.log(orderGoods)
        	}).catch((err)=>{
      			console.log(err);
      	  })
        }
      },
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
      gotoOrderDetail(){
        // 保存到全局变量中
        console.log("准备跳转订单详情")
        getApp().globalData.order_detail = this.order
        getApp().globalData.order_goods = this.orderGoods
        uni.navigateTo({
          url: '/subpkg/order_detail/order_detail'
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
.order{
  background-color: #ffffff;
  border-radius: 10px;
  margin: 7px;
  padding: 10px;
  .title{
     display: flex;
     justify-content: space-between;
     align-items: center;
     line-height: 30px;
     font-size: 14px;
     color: #9e9e9e;
     border-bottom: 1px solid #f0f0f0;
     .status{
       color: #00af1a;
     }
   }
}

</style>
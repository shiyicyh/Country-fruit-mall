<template>
  <view class="order-container">
    <my-address></my-address>
    <view class="div">
      <view class="title">
        <image :src="logourl"  class="logo"></image>
        <image :src="texturl"  class="text"></image>
      </view>
      <view>
        <block v-for="(goods) in cart" :key="goods.goods_id">
          <my-goods v-if="goods.goods_state" :goods="goods" :iforder="true"></my-goods>
        </block>
      </view>
      <view style="text-align: right;">
        <text style="font-size: 15px;color: #000000;">共{{checkedCount}}件</text>
      </view>
    </view>
    <view class="div">
      <view class="info-item">
        <text>配送方式</text>
        <text>快递到家</text>
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
    <view class="footer">
      <view class="left">
        待支付：<text>￥{{checkedGoodsAmount | toPrice}}</text>
      </view>
      <view class="right" @click="payOrder()">
        去支付
      </view>
    </view>
    <!-- 支付确认框 -->
    <uni-popup ref="payDialog" type="dialog">
    				<uni-popup-dialog type="info" cancelText="取消" confirmText="付款" title="确认支付" content="是否确认付款" @confirm="dialogConfirm()"
    					@close="dialogClose()"></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
  const db = uniCloud.database();
  import { mutations} from '@/uni_modules/uni-id-pages/common/store.js'
  import { mapState,mapGetters,mapMutations} from 'vuex'
  export default {
    computed:{
      ...mapState('m_cart',['cart']),
      ...mapGetters('m_user', ['addstr']),
      ...mapGetters('m_cart', ['checkedCount', 'total','checkedGoodsAmount']),
    },
    data() {
      return {
        logourl:'https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/ceb61727-8b7b-4deb-8a9e-833838fd2cc8.png',
        texturl:'https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/b762412d-3839-45c5-8895-55401191d45f.png'
      };
    },
    methods:{
      ...mapMutations('m_cart', ['saveToStorage']),
      payOrder(){
        if (!this.addstr) return uni.showToast({title: '请选择收货地址',duration: 2000,icon:'none'})
        
        this.$refs.payDialog.open()//打开支付确认框
        
        // mutations.updateCart()
      },
      dialogConfirm(){
        this.addOrder(1)
        console.log("确认支付")
      },
      dialogClose(){
        this.addOrder(0)
        console.log("取消了支付")
      },
      // 添加订单
      async addOrder(status){
        // 整理购买商品信息
        let buygoods=this.$store.state.m_cart.cart.filter(x => x.goods_state)
        buygoods = buygoods.map(function(item,index){
            return {good_id:item.goods_id,buynum:item.goods_count}
        })
        // 整理收货地址信息
        const address={
          addstr:this.addstr,
          userName:this.$store.state.m_user.address.userName,
          telNumber:this.$store.state.m_user.address.telNumber,
        }
        const orderinfo={
          buy_goods:buygoods,
          user_address:address,
          status:status,
          total_count:this.checkedCount,
          total_fee:parseInt(this.checkedGoodsAmount),
          pay_date:status==1?Date.now():null
        }
        db.collection('uni-pay-orders').add(orderinfo).then( res =>{
          db.collection('uni-pay-orders')
          .where('_id=="'+res.result.id+'"')
          .get()
          .then((res)=>{
            getApp().globalData.order_detail =res.result.data[0]
            getApp().globalData.order_goods = this.$store.state.m_cart.cart.filter(x => x.goods_state==true)
            const newCart=this.$store.state.m_cart.cart.filter(x => x.goods_state==false)
            this.$store.state.m_cart.cart= newCart
            this.saveToStorage()
            console.log("购物车更新")
            console.log(this.$store.state.m_cart.cart)
            // uni.setStorageSync('cart',JSON.stringify(newCart))
            // console.log(uni.getStorageSync('cart'))
            uni.redirectTo({
              url:'../order_detail/order_detail'
            })
          }).catch((err)=>{
          	console.log(err);
          })
        })
        if(status==1){//确认支付则减去商品对应库存
            for(let i=0;i<buygoods.length;i++){
              //访问云对象空间
              const incGood = uniCloud.importObject('inc-goods')
              //调用云对象方法
              try {
              	const res = await incGood.updateGood(buygoods[i].good_id,buygoods[i].buynum)
              } catch (e) {
              	console.log(e.errCode)
              	console.log(e.errMsg)
              }
            }
        }
      }
    },
  }
</script>

<style lang="scss">
page{
  background-color: #ebebeb;
  
}
.order-container{
  padding-bottom: 50px;
}
.div{
  background-color: #ffffff;
  border-radius: 10px;
  margin: 5px;
  padding: 10px;
  .title{
     display: flex;
     align-items: center;
     padding-bottom: 12px;
     .logo{
       width: 30px;
       height:24px;
       padding-left: 5px;
       // background-color: red;
     }
     .text{
       width: 80px;
       height: 18px;
       // background-color: blue;
       margin-left: 6px;
     }
     
   }
}

.info-item{
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  line-height: 26px;
}
.footer{
  height: 50px;
  box-sizing: border-box;
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  .left{
    font-size: 14px;
    color: #000;
    text{
      font-size: 18px;
      color: #c00000;
    }
  }
  .right{
    border-radius: 20px;
    width: 100px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    background-color: #078f1c;
  }
}
</style>

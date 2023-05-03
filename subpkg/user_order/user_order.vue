<template>
  <view class="user-order">
    <uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" styleType="text" activeColor="#2e843c" class="segmented"></uni-segmented-control>
    <view class="content">
      <block v-for="(order) in orders" :key="order._id">
        <my-order :order="order"></my-order>
      </block>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.databaseForJQL();
  export default {
    data() {
      return {
        items: ['全部', '待支付', '待发货','待收货','待评价'],
        current: 0,
        orders:[]
      };
    },
    onLoad: function (option) {//参数传递
      // 获取商品 Id
      this.current = ++option.status
      this.getOrder()
      // 调用请求商品详情数据的方法
    },
    methods:{
      onClickItem(e) {
      	if (this.current !== e.currentIndex) {
      		this.current = e.currentIndex
      	}
        this.getOrder()
      },
      getOrder(){
        let where=''
        if(this.current==0){//搜索全部订单
          where="status != -2 && user_id ==$cloudEnv_uid"  //-2为用户选择删除的订单
        }else{
          where="status=="+(this.current-1) +" && user_id ==$cloudEnv_uid"
          console.log(where)
        }
        
        db.collection('uni-pay-orders')
        .where(where)
        .get()
        .then((res)=>{
          console.log("获取订单信息")
          console.log(res)
          this.orders=res.data
        }).catch((err)=>{
        	console.log(err);
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .user-order{
    background-color: #ebebeb;
    // min-height: 100vh;
    min-height: 100vh;
    padding-top: 36px;
    padding-bottom: 10px;
      .segmented{
        position: fixed;
        top: 0px;
        left: 0px;
        right: 0px;
        background-color:  #ebebeb;
        z-index: 2;
        // margin-bottom: 7px;
      }
      .content{
        padding-top: 7px;
        // :nth-last-child(1){
        //   margin-bottom: 10px;
        // }
        // background-color: red;
        // box-sizing: border-box;
        // height: 100vh;
      }
  }
</style>
<style lang="scss">

</style>

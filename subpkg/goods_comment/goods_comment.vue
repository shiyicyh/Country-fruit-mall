<template>
  <view class="goods-comment">
    <block v-for="(good,i) in goods" :key="i">
      <view class="comment-box">
        <view class="header">
          <image :src="good.goods_thumb" mode="aspectFit"></image>
          <view class="header-right">
            <view class="title">{{good.standard}} | {{good.name}}</view>
            <view class="rate">
              评分
              <uni-rate :value="goods[i].rate_count" :index="i" @change="onChange()"/>
            </view>
          </view>
        </view>
        <view class="content">
          <uni-easyinput type="textarea" trim="all" :index="i" :value="goods[i].comment_content" placeholder="请输入内容" maxlength="200" @change="textChange()">
          </uni-easyinput>
          <c-image name="contentImg" v-model="good.comment_img" :value="good.comment_img" :imageNumber="8" :isWrap="true" size="140x140"/>
        </view>
      </view>
    </block>
    <view class="bottom">
      <view class="button" @click="submit()">提交评价</view>
    </view>
  </view>
</template>

<script>
  const db = uniCloud.databaseForJQL();
  import {store} from '@/uni_modules/uni-id-pages/common/store.js'
  export default {
    data() {
      return {
        goods:[],
        orderId:''
      };
    },
    computed: {
    	userInfo() {
    		return store.userInfo
    	},
    },
    onLoad(e) {
      this.orderId=e.orderId
      console.log(this.orderId)
      
    },
    onShow() {
      if(this.goods.length<=0){
        this.goods=getApp().globalData.order_goods
        let newarr = [];
        let username=this.userInfo.nickname
        this.goods.map((item,index)=>{
        	newarr.push(Object.assign(item,{comment_img:[],comment_content:'',rate_count:5,user_name:username}))
        })
        this.goods = newarr;
      }
      
    },
    methods:{
      onChange(e){
        this.goods[e.index].rate_count=e.value
        console.log(this.goods)
      },
      textChange(e){
        this.goods[e.index].comment_content=e.val
        console.log("评价内容")
        console.log(this.goods)
      },
      async submit(){
        console.log("准备提交")
        console.log(this.goods)
        let commentInfo=[]
        for(let i=0;i<this.goods.length;i++){
          let item={
            "good_id":this.goods[i]._id,
            "user_name":this.goods[i].user_name,
            "comment_content":this.goods[i].comment_content?this.goods[i].comment_content : '此用户没有填写文本',
            "comment_img":this.goods[i].comment_img,
            "rate_count":this.goods[i].rate_count
          }
          commentInfo.push(item)
        }
       await db.collection("goods-comments")
         .add(commentInfo)
         .then((res) => {
           this.updateCommentCount()
         })
         .catch((err) => {
           console.log(err)
         })
         
        await db.collection('uni-pay-orders')
         .where("_id=='"+this.orderId+"'")
         .update({status:4})
         .then(res => {
           console.log(res)
           // setTimeout(uni.navigateBack(),3000)
           console.log("订单状态更新成功")
         }).catch((err)=>{
         		console.log(err);
           })
            uni.showToast({
            title: '评价成功'
           })
           setTimeout(() => uni.navigateBack(), 1500)
          
      },
      async updateCommentCount(){
        const incGood = uniCloud.importObject('inc-goods')
        for(let i=0;i<this.goods.length;i++){
          //调用云对象方法
          try {
          	const res = await incGood.updateGoodComment(this.goods[i]._id)
          } catch (e) {
          	console.log(e.errCode)
          	console.log(e.errMsg)
          }
        }
      }
    }
  }
</script>

<style lang="scss">
.goods-comment{
  background-color: #ebebeb;
  min-height: 100vh;
  box-sizing: border-box;
  padding: 7px;
  padding-bottom: 60px;
  .comment-box{
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 10px;
    margin: 7px 0;
    .header{
      display: flex;
      align-items: center;
      width: 100%;
      image{
        width: 15vw;
        height: 15vw;
        display: block;
      }
      .header-right{
        flex: 1;
        padding-left: 10px;
        
        .title{
          width: 73.3vw;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rate{
          padding-top: 5px;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: gray;
        }
      }
    }
    .content{
      background-color: #f0f0f0;
      width: 100%;
      border-radius: 10px;
      box-sizing: border-box;
      padding: 7px;
      margin-top: 10px;
      .uni-easyinput{
        .uni-easyinput__content{
          border: none;
          background-color: #f0f0f0 !important;
          textarea{
            height: 40px !important;
            min-height: 40px !important;
            padding-left: 0px !important;
          }
        }
      }
      
    }
  }
  .bottom{
    background-color: #fff;
    padding: 10px 0;
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    .button{
      width: 90%;
      height: 45px;
      background-color: #8fd604;
      font-size: 20px;
      border-radius: 20px;
      text-align: center;
      line-height: 45px;
    }
  }
}
</style>

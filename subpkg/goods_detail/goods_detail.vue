<template>
  <view v-if="goods_info.name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.goods_swiper_imgs" :key="i">
        <image :src="item" @click="preview(i)" mode="aspectFill"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-header-box box">
      <!-- 标题、描述、价格 -->
      <h4>{{goods_info.name}}</h4>
      <view class="desc">{{goods_info.goods_desc}}</view>
      <view class="bottom">
        <view class="price">￥<text>{{goods_info.goods_price | toPrice}}</text></view>
        <view>销量 {{goods_info.total_sell_count}}</view>
      </view>
      
    </view>
    
    <view class="goods-info-box box">
      <view>
        <text class="info-title">配送</text><text class="info">包邮到家</text>
      </view>
      <view>
        <text class="info-title">规格</text><text class="info">{{goods_info.standard}}</text>
      </view>
    </view>
    <view class="comment box" v-if="comment.user_name" @click="gotoComment()">
      <view class="header">
        <text class="count">用户评价（{{goods_info.comment_count}}）</text>
        <text class="good">好评{{rating}}% ></text>
      </view>
      <my-comment :ifdetail="true" :info="comment"></my-comment>
    </view>
    <!-- 商品详情信息 -->
    <view class="goods-introduce-box box">
      <view class="detail-text">商品详情</view>
      <view class="id">
        <text>编号</text>
        <text>{{goods_info._id}}</text>
      </view>
      <image v-for="item in goods_info.goods_introduce_imgs" :src="item" mode="widthFix" class="introduce-img"></image>
    </view>
    <!-- 商品导航组件 -->
    <view class="goods_nav"> 
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import {mapMutations,mapGetters} from 'vuex'
  const db = uniCloud.databaseForJQL();
  export default {
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        // 左侧按钮组的配置对象
        options: [{
          icon: 'shop',
          text: '首页'
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0,
        }],
        // 右侧按钮组的配置对象
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: '#ff0000',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: '#ffa200',
            color: '#fff'
          }
        ],
        comment:{},
        rating:0
      }
    },
    onLoad: function (option) {//参数传递
      // 获取商品 Id
      const goods_id = option.goods_id
      // 调用请求商品详情数据的方法
      this.getGoodsDetail(goods_id)
    },
    onShow(){
       this.options[1].info=this.total
    },
    computed:{
      ...mapGetters('m_cart', ['total']),
    },
    methods: {
      ...mapMutations('m_cart',['addToCart']),
      // 定义请求商品详情数据的方法
      getGoodsDetail(goods_id) {
        db.collection('opendb-mall-goods')
        	.where("_id=='"+goods_id+"'")
          .field("_id,goods_desc,goods_price,name,goods_swiper_imgs,goods_introduce_imgs,standard,goods_thumb,remain_count,comment_count,total_sell_count")
        	.get()
        	.then((res)=>{
            // res 为数据库查询结果
            this.goods_info = res.data[0]
            console.log(this.goods_info)
        	}).catch((err)=>{
        		console.log(err.code); // 打印错误码
        		console.log(err.message); // 打印错误内容
          })
        db.collection('goods-comments').where("good_id=='"+goods_id+"' && status==1").field("user_name,comment_content,rate_count,comment_date").orderBy("comment_date desc").limit(1).get()
        .then((res)=>{
          console.log("评论查询结果")
          console.log(res)
          // res 为数据库查询结果
          this.comment = res.data[0]
          console.log(this.comment)
        }).catch((err)=>{
        	console.log(err.code); // 打印错误码
        	console.log(err.message); // 打印错误内容
        })
        //计算好评率
        db.collection('goods-comments').where("good_id=='"+goods_id+"' && status==1").field("rate_count").get()
        .then((res)=>{
          //获得好评数量
          const arr=res.data.filter(x => x.rate_count>3)
          //计算好评率，好评数量除以总评乘以100
          this.rating = (( arr.length / res.data.length ) *100).toFixed(1)
          // res 为数据库查询结果
          // console.log(this.comment)
        }).catch((err)=>{
        	console.log(err.code); // 打印错误码
        	console.log(err.message); // 打印错误内容
        })
        
      },
      // 实现轮播图的预览效果
      preview(i) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          // 预览时，默认显示图片的索引
          current: i,
          // 所有图片 url 地址的数组
          urls: this.goods_info.goods_swiper_imgs.map(x => x)
        })
      },
      // 左侧按钮的点击事件处理函数
      onClick(e) {
        if (e.content.text === '购物车') {
            // 切换到购物车页面
            uni.switchTab({
              url: '/pages/cart/cart'
            })
        }
        if (e.content.text === '首页') {
            // 切换到购物车页面
            uni.switchTab({
              url: '/pages/home/home'
            })
        }
      },
      buttonClick(e){
        if (e.content.text === '加入购物车') {
            // 切换到购物车页面
            this.addToCart(this.goods_info)
            this.options[1].info=this.total
        }
        if (e.content.text === '立即购买') {
            uni.showToast({
              title: '该模块待开发',
              duration: 2000
            });
        }
      },
      gotoComment(){
        uni.navigateTo({
          url: '/subpkg/comment-list/comment-list?good_id='+ this.goods_info._id
        })
      }
      
    }
  }
</script>

<style lang="scss">
.goods-detail-container {
  // 给页面外层的容器，添加 50px 的内padding，
  // 防止页面内容被底部的商品导航组件遮盖
  padding-bottom: 50px;
  background-color: #efefef;
}
.box{
  margin: 7px;
  border-radius: 5px;
  background-color: #fff;
}
swiper {
  height: 750rpx;

  image {
    width: 100%;
    height: 100%;
  }
}
// 商品信息区域的样式
.goods-header-box {
  padding: 17px;
  padding-right: 10px;
  .desc{
    font-size: 14px;
    color: gray;
    padding: 10px 0;
  }
  .bottom{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: gray;
    .price {
      color: #c00000;
      text{
        font-size: 20px;
      }
    }
  }
}
.goods-info-box{
  font-size: 12px;
  view{
    padding: 8px 0;
    line-height: 12px;
  }
  .info-title{
    margin: 15px;
    color: gray;
  }
  .info{
    color: #000;
  }
}
.comment{
  padding: 10px;
  padding-bottom: 0;
  .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .count{
      font-size: 15px;
      color: #000;
    }
    .good{
      font-size: 12px;
      color: #e2644e;
    }
  }
}
.goods-introduce-box{
  overflow: hidden;
  .detail-text{
    font-size: 13px;
    margin: 10px;
    font-weight: 600;
  }
  .id{
    box-sizing: border-box;
    margin:10px ;
    // width: calc(100% - 20px);
    padding: 10px;
    font-size: 12px;
    background-color: #ebebeb;
    border-radius: 10px;
    :nth-child(1){
      color: gray;
      padding-right: 10px;
    }
  }
  .introduce-img{
    display: block; 
    width: 100%;
  }
}

.goods_nav {
  // 为商品导航组件添加固定定位
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>

<template>
  <view v-if="goods_info.name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.goods_swiper_imgs" :key="i">
        <image :src="item" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-header-box box">
      <!-- 标题、描述、价格 -->
      <!-- 商品价格 -->
      <h4>{{goods_info.name}}</h4>
      <view class="desc">{{goods_info.goods_desc}}</view>
      <view class="price">￥<text>{{goods_info.goods_price}}</text></view>
      
    </view>
    
    <view class="goods-info-box box">
      <view>
        <text class="info-title">配送</text><text class="info">包邮到家</text>
      </view>
      <view>
        <text class="info-title">规格</text><text class="info">{{goods_info.standard}}</text>
      </view>
    </view>
    <!-- 商品详情信息 -->
    <view class="goods-introduce-box box">
      <view class="detail-text">商品详情</view>
      <image v-for="item in goods_info.goods_introduce_imgs" :src="item" mode="widthFix" class="introduce-img"></image>
    </view>
    <!-- <rich-text :nodes="goods_info.goods_introduce"></rich-text> -->
    <!-- 商品导航组件 -->
    <view class="goods_nav"> 
      <!-- fill 控制右侧按钮的样式 -->
      <!-- options 左侧按钮的配置项 -->
      <!-- buttonGroup 右侧按钮的配置项 -->
      <!-- click 左侧按钮的点击事件处理函数 -->
      <!-- buttonClick 右侧按钮的点击事件处理函数 -->
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
          .field("goods_desc,goods_price,name,goods_swiper_imgs,goods_introduce_imgs,standard,goods_thumb,remain_count")
        	.get()
        	.then((res)=>{
            // res 为数据库查询结果
            console.log("详情结果")
            console.log(res)
            this.goods_info = res.data[0]
            console.log(this.goods_info)
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
  padding-right: 0;
  .desc{
    font-size: 14px;
    color: gray;
    padding: 10px 0;
  }
  .price {
    color: #c00000;
    font-size: 14px;
    text{
      font-size: 20px;
    }
  }

  // .goods-header-body {
  //   display: flex;
  //   justify-content: space-between;

  //   .goods-name {
  //     font-size: 16px;
  //     padding-right: 10px;

  //   }
  //   // 收藏区域
  //   .favi {
  //     width: 120px;
  //     font-size: 12px;
  //     display: flex;
  //     flex-direction: column;
  //     justify-content: center;
  //     align-items: center;
  //     border-left: 1px solid #efefef;
  //     color: gray;
  //   }
  // }

  // 运费
  // .yf {
  //   margin: 10px 0;
  //   font-size: 12px;
  //   color: gray;
  // }
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
.goods-introduce-box{
  overflow: hidden;
  .detail-text{
    font-size: 13px;
    margin: 10px;
    font-weight: 600;
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

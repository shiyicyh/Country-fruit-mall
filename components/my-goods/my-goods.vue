<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#3ac368" v-if="ifcart" @click="radioClick"></radio>
      <image :src="goods.goods_thumb || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="top">
        <view class="goods-name">
           <text>{{goods.name}}</text>
           <text v-if="!ifcart">{{goods.standard}}</text>
         </view>
         <view class="goods-standard">{{ifcart==true?goods.standard:goods.goods_desc}}</view>
         </view>
      
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{goods.goods_price}}</view>
        <!-- 商品数量 -->
        <uni-number-box :max="goods.goods_remain" :value="goods.goods_count" @change="numChange" v-if="ifcart"></uni-number-box>
        <!-- 购物车按钮 -->
        <view class="shopcat" @click="cartBt(goods)" v-if="!ifcart">
          <uni-icons custom-prefix="iconfont" type="icon-gouwuche" size="18" color="#fff"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import {mapMutations} from 'vuex'
import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    name:"my-goods",
    props:{
      // 商品的信息对象
      goods:{
        type:Object,
        default:{},
      },
      // 是否为购物车页面
      ifcart:{
        type:Boolean,
        default:false,//默认不显示
      },
      // // 是否展示价格右侧的 NumberBox 组件
      // showNum: {
      //   type: Boolean,
      //   default: false,
      // },
    },
    data() {
      return {
        defaultPic:"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/6e8a80f4-2d01-480c-a46b-658908e53442.png"
      };
    },
    methods:{
      ...mapMutations('m_cart',['addToCart']),
      radioClick(){
        //触发父组件radio-change事件，同时将商品id和状态作为参数传递
        this.$emit('radio-change',{
          goods_id:this.goods.goods_id,
          goods_state:!this.goods.goods_state
        })
      },
      // NumberBox 组件的 change 事件处理函数
      numChange(val) {
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('num-change', {
          // 商品的 Id
          goods_id: this.goods.goods_id,
          // 商品的最新数量
          goods_count: +val
        })
      },
      //添加购物车按钮
      cartBt(item){
        this.addToCart(item)
        this.setBadge()
      }
    }
  }
</script>

<style lang="scss">

  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 100%;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 80px;
        height: 80px;
        display: block;
      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 15px;
      }
      .goods-standard{
        font-size: 13px;
        color: #9e9e9e;
      }
      .goods-info-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .shopcat{
        display: inline-block;
        width: 34px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        border-radius: 17px;
        background-color: #35ac3b;
        
      }
      }
      .goods-price {
        font-size: 16px;
        color: #c00000;
      }
      
    }
  }
</style>
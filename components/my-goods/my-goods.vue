<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#3ac368" v-if="ifcart" @click="radioClick"></radio>
      <image :src="goods.goods_thumb || defaultPic" class="goods-pic" :style="{width:imgsize+'px',height:imgsize+'px'}" @click="gotoDetail(goods._id)"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="top" @click="gotoDetail(goods._id)">
        <view class="goods-name">
          <text>{{goods.name}}</text>
          <text v-if="!ifcart && !iforder">{{goods.standard}}</text>
        </view>
        <view class="goods-standard">{{ifcart || iforder?goods.standard:goods.goods_desc}}</view>
      </view>
      
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view :class="iforder?'goods-price-gray':'goods-price-red'">
          <span v-if="iforder">单价：</span>
          <span v-else>￥</span>
          {{goods.goods_price | toPrice}}
        </view>
        <!-- 商品数量 -->
        <uni-number-box :max="goods.goods_remain" :value="goods.goods_count" @change="numChange" v-if="ifcart"></uni-number-box>
        <view v-else-if="iforder" class="goods-count">x{{goods.goods_count}}</view>
        <!-- 购物车按钮 -->
        <view class="shopcat" @click="cartBt(goods)" v-else>
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
      //是否为订单页
      iforder:{
        type:Boolean,
        default:false,
      },
      imgsize:{
        type:Number,
        default:80,
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
        uni.showToast({
        	title: '已加入购物车',
        	duration: 1000,
          icon:'none'
        });
      },
      // 点击跳转到商品详情页面
      gotoDetail(id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + id
        })
      },
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
        .goods-count{
          color: #313131;
          font-size: 16px;
        }
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
      .goods-price-red {
        font-size: 16px;
        color: #c00000;
      }
      .goods-price-gray{
        font-size: 12px;
        color: gray;
      }
    }
  }
</style>
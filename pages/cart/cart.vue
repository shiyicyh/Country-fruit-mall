<template>
  <view class="cart-container" v-if="cart.length != 0">
    <view class="main">
      <!-- 商品列表 -->
      <uni-swipe-action>
        <block v-for="(goods) in cart" :key="goods.goods_id">
          <uni-swipe-action-item :right-options="options" @click="swipeActionClick(goods)">
              <my-goods :goods="goods" :ifcart="true" @radio-change="radioChange" @num-change="numberChange"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
    </view>
    <!-- 底部 -->
    <my-settle></my-settle>
  </view>
  <!-- 空白购物车区域 -->
    <view class="empty-cart" v-else>
      <image :src="cart_empty_img" class="empty-img"></image>
      <text class="tip-text">购物车为空</text>
    </view>
</template>

<script>
  import { mapState,mapMutations} from 'vuex'
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  
  export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    computed:{
      ...mapState('m_cart',['cart']),
    },
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }],
        cart_empty_img:'https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/82b413f8-1e0b-49d2-9220-1f151eb4a859.png'
      }
    },
    methods:{
      ...mapMutations('m_cart', ['updateGoodsState','updateGoodsCount','removeGoodsById']),
      radioChange(goods){// 商品的勾选状态发生了变化
        this.updateGoodsState(goods)
      },
      // 商品的数量发生了变化
      numberChange(goods) {
        this.updateGoodsCount(goods)
        this.setBadge()
      },
      // 点击了滑动操作按钮
      swipeActionClick(goods) {
        this.removeGoodsById(goods.goods_id)
        this.setBadge()
      },
      
    },
  }
</script>

<style lang="scss">
page{
  background-color: #ebebeb;
}
.cart-container{
  padding-bottom: 50px;
}
.main{
  border-radius: 10px;
  background-color: #fff;
  margin: 7px;
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // background-color: #28eb80;
  height:100vh;
  // min-height: 450px;
  // padding-top: 150px;

  .empty-img {
    width: 180px;
    // height: 180px;
  }
  .tip-text{
    font-size: 14px;
    color: gray;
    margin-top: 15px;
  }
}
</style>

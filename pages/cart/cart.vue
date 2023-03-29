<template>
  
  <view class="body">
    
    <view class="main">
      <!-- 商品列表 -->
      <uni-swipe-action>
        <block v-for="(goods) in cart" :key="goods.goods_id">
          <uni-swipe-action-item :right-options="options" @click="swipeActionClick(goods)">
              <my-goods :goods="goods" :show-radio="true" :show-num="true" @radio-change="radioChange" @num-change="numberChange"></my-goods>
          </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
    </view>
  </view>
</template>

<script>
  import { mapState,mapMutations } from 'vuex'
  
  export default {
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
      },
      // 点击了滑动操作按钮
      swipeActionClick(goods) {
        this.removeGoodsById(goods.goods_id)
      },
      
    },
  }
</script>

<style lang="scss">
page{
  background-color: #ebebeb;
}
</style>

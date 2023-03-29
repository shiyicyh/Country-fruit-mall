export default {
  namespaced:true,
  
  state:()=>({
    //购物车数组，每个对象包含以下属性
    //{goods_id,goods_name,goods_price,goods_desc,goods_thumb,goods_remain,goods_count,goods_state}
    //商品ID，商品名称，商品价格，商品描述，商品缩略图，商品库存，商品购物车数量,商品勾选状态
    cart:[],
  }),
  mutations:{
    addToCart(state,goods){
      //根据商品id查询购物车是否有该商品
      const findResult = state.cart.find((x) => x.goods_id ===goods.goods_id)
      if(!findResult){
        //购物车中没有该商品
        state.cart.push(goods)
      }else{
        findResult.goods_count++
      }
    },
    updateGoodsState(state,goods){
      // 根据goods_id查询购物车中对应商品的信息对象
      const findResult=state.cart.find(x => x.goods_id === goods.goods_id)
      
      if(findResult){//有对应的商品信息对象
        // 更新对应的商品勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化保存到本地
        // this.commit('m_cart/saveToStorage')
      }
    },
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
    
      if(findResult) {
        if(goods.goods_count === 0){
          this.commit('m_cart/removeGoodsById',goods.goods_id)
        }else{
          // 更新对应商品的数量
          findResult.goods_count = goods.goods_count
          // 持久化存储到本地
          // this.commit('m_cart/saveToStorage')
        }
        
        
      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      // 调用数组的 filter 方法进行过滤
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 持久化存储到本地
      // this.commit('m_cart/saveToStorage')
    },
  },
  getters:{},
}
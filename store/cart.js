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
  },
  getters:{},
}
export default {
  namespaced:true,
  
  state:()=>({
    //购物车数组，每个对象包含以下属性
    //{goods_id,goods_name,goods_price,goods_standard,goods_thumb,goods_remain,goods_count,goods_state}
    //商品ID，商品名称，商品价格，商品规格，商品缩略图，商品库存，商品购物车数量,商品勾选状态
    cart:JSON.parse(uni.getStorageSync('cart') || '[]'),
  }),
  mutations:{
    saveToStorage(state){
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    resetStatecart(state,data){
      state.cart=JSON.parse('[]')
      this.commit('m_cart/saveToStorage')
    },
    addToCart(state,items){
      //判断是否为数组
      const isarray=Array.isArray(items)
      if(isarray){
        for(let i=0;i<items.length;i++){
          items[i].isarray=isarray
          this.commit('m_cart/pushCart',items[i])
        }
      }else{
        items.isarray=isarray
        this.commit('m_cart/pushCart',items)
      }
      
      // 通过commit方法，调用m_cart命名空间下的saveToStorage方法
      this.commit('m_cart/saveToStorage')
    },
    pushCart(state,item){
      let goods={}
      if(item.isarray){
        goods= {
           goods_id:item.good_id[0]._id,
           name:item.good_id[0].name,
           goods_price:item.good_id[0].goods_price,
           standard:item.good_id[0].standard,
           goods_thumb:item.good_id[0].goods_thumb,
           goods_remain:item.good_id[0].remain_count,
           goods_count:item.good_count,
           goods_state:item.good_state,
        }
      }else{
        goods = {
          goods_id:item._id,
          name:item.name,
          goods_price:item.goods_price,
          standard:item.standard,
          goods_thumb:item.goods_thumb,
          goods_remain:item.remain_count,
          goods_count:1,
          goods_state:true//默认选中
        }
      }
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
        this.commit('m_cart/saveToStorage')
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
          this.commit('m_cart/saveToStorage')
        }

      }
    },
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods_id) {
      // 调用数组的 filter 方法进行过滤
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },
  getters:{
    // 统计购物车中商品的总数量
    total(state){
      let c=0
      // 循坏统计商品的数量，累加到变量c中
      console.log("当前购物车")
      console.log(state.cart)
      state.cart.forEach(goods => c+= goods.goods_count)
      return c
    },
    // 勾选的商品的总数量
    checkedCount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品总数量进行累加
      // reduce() 的返回值就是已勾选的商品的总数量
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选的商品的总价
    checkedGoodsAmount(state) {
      // 先使用 filter 方法，从购物车中过滤器已勾选的商品
      // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
      // reduce() 的返回值就是已勾选的商品的总价
      // 最后调用 toFixed(2) 方法，保留两位小数
      let val=state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0)
      return val
    },
  },
}
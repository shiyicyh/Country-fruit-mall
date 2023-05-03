<template>
  <view>
    <uni-search-bar v-model="good_search" class="good-search" radius="5" :placeholder="good_search" clearButton="auto" cancelButton="none" @confirm="getGoodsList()"  bgColor="#ebebeb"/>
    <view class="container">
      <block v-for="(good,i) in searchList" :key="i">
        <my-goods :goods="good"></my-goods>
      </block>
    </view>
    
  </view>
</template>

<script>
  const db = uniCloud.databaseForJQL();
  export default {
    data() {
      return {
        good_search:'',//搜索框值
        searchList:[],//搜索结果列表
      };
    },
    onLoad: function (option) {//参数传递
      // 获取商品 Id
       this.good_search = option.search
      // 调用请求商品详情数据的方法
      this.getGoodsList()
    },
    methods:{
      getGoodsList(){
        db.collection('opendb-mall-goods')
        // 
        // "name=='"+this.good_search+"'"
        	.where(`${new RegExp(this.good_search, 'i')}.test(name)`)
          .field("goods_thumb,name,goods_price,goods_desc,standard")
        	.get()
        	.then((res)=>{
            this.searchList = res.data
        	}).catch((err)=>{
        		console.log(err.code); // 打印错误码
        		console.log(err.message); // 打印错误内容
          })
      },
    },
  }
</script>

<style lang="scss">

</style>

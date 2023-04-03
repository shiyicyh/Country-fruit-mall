<template>
  <view>
    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <view class="left-scroll-view">
        <block v-for="(item, i) in cateList" :key="i">
        <view :class="['left-scroll-view-item', i === active ? 'active' : '']" @click="activeChanged(i)">{{item.name}}</view>
        </block>
      </view>
      
      
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <block v-for="(goods,i) in cateLeve2" :key="i">
          <my-goods :goods="goods"></my-goods>
        </block>
          
      </scroll-view>
      
    </view>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  const db = uniCloud.database();
  export default {
    mixins: [badgeMix],
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        // 当前选中项的索引，默认让第一项被选中
        active: 0,
        // list_field:'name',
        cateList:[],
        cateLeve2:[],
      }
      
    },
    onLoad(){
      // 获取当前系统的信息
       const sysInfo = uni.getSystemInfoSync()
       // 为 wh 窗口可用高度动态赋值
       this.wh = sysInfo.windowHeight
       //调用获取分类列表数据的方法
       this.getCateList()
       
      },
    methods: {
      getCateList() {
      // 获取分类列表
       db.collection('opendb-mall-categories').field('name,_id').get().then((res)=>{
         this.cateList=res.result.data
         this.getCateLeve2()
	     }).catch((err)=>{
	     	console.log(err);
       })	
      },
      getCateLeve2(){
        var where=''
        // 爆款分类
        if(this.active==0){
          where="is_hot==true"
        }
        // 新品分类
        else if(this.active==1){
          where="is_new==true"
        }else{
          where="category_id=='"+this.cateList[this.active]._id+"'"
        }
        // 获取二级数据
        db.collection('opendb-mall-goods')
      		.where(where)
          .field('goods_thumb,name,goods_price,goods_desc,standard')
      		.get()
      		.then((res)=>{
            this.cateLeve2=res.result.data
      		}).catch((err)=>{
      			console.log(err);
      	  })
      },
      // 选中项改变的事件处理函数
      activeChanged(i) {
        this.active = i
        this.getCateLeve2()
      },
    },
  }
</script>

<style lang="scss">
.scroll-view-container {
  display: flex;
  
  .left-scroll-view{
    width: 100px;
    height: 100vh;
    background-color: #f7f7f7;
    .left-scroll-view-item {
      line-height: 50px;
      font-size: 12px;
      text-align: center;
      
      // 激活项的样式
      &.active {
        background-color: #ffffff;
        position: relative;
        // 渲染激活项左侧的红色指示边线
        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #00ac05;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
    }
  }
}
</style>

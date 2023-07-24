<template>
  <view class="home">
    <!-- 搜索栏 -->
    <uni-search-bar v-model="good_search" class="good-search" v-bind:style="{ top: searchStyle.top, right: searchStyle.right}" :class="{ 'focus-search': isfocus }" radius="20" :placeholder="good_search" clearButton="auto" cancelButton="none" @confirm="search()" @focus="this.isfocus=true" @blur="this.isfocus=false" bgColor="#ffffff"/>
    <!-- 轮播图区域 -->
    <swiper indicator-dots="true" indicator-active-color="#1830b8" autoplay="true" interval="3000" duration="1000" circular="true">
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <view class="swiper-item">
          <image :src="item.image_src" mode="aspectFill"></image>
        </view>
      </swiper-item>
    </swiper>
    <!-- 轮播图区域结束 -->
    <!-- 公告栏区域 -->
    <uni-notice-bar show-icon scrollable color="#fff" background-color="#54a564" 
    		text="配送服务升级!全场单件包邮免运费!品质保障、好吃不贵,新鲜美味送到家~" />
    <!-- 横幅区域 -->
    
        <navigator url="/pages/my/my" open-type="switchTab">
          <view class="scroll">
           <image :src="scroll_1" mode="widthFix"></image>
           </view>
        </navigator>
    <!-- 商品列表 -->
    <!-- 商品列表开始 -->
    <view class="goods-list">
      <view>
        <image :src="scroll_2" class="top-img"></image>
      </view>
      <view class="list-main">
        <unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="formData" :collection="collection"
         :field="field" where="is_on_sale==true" orderby="last_modify_date desc" @load="load">
        	<!-- 基于 uni-list 的页面布局 -->
        	<uni-list class="uni-list--waterfall">
        		<!-- to 属性携带参数跳转详情页面-->
        		<uni-list-item :border="false" class="uni-list-item--waterfall" title="自定义商品列表" v-for="item in data" :key="item._id" :to="'/subpkg/goods_detail/goods_detail?goods_id=' + item._id">
              
        			<!-- 通过header插槽定义列表左侧图片 -->
        			<template v-slot:header>
        				<view class="uni-thumb shop-picture shop-picture-column">
        					<image :src="item.goods_thumb" mode="aspectFill"></image>
        				</view>
        			</template>
        			<!-- 通过body插槽定义商品布局 -->
        			<template v-slot:body>
        				<view class="shop">
        					<view>
        						<view class="uni-title">
        							<text class="uni-ellipsis-2">{{ item.name+' '+item.standard}}</text>
        						</view>
                    <view>
                      <text class="uni-tag hot-tag" v-if="item.is_hot">爆款</text>
                      <text class="uni-tag hot-tag" v-if="item.is_new">新品</text>
        							<text class="uni-tag item-tag">坏果包赔</text>
        						</view>
                    <view class="uni-note uni-ellipsis-1">{{ item.goods_desc }}</view>
        					</view>
        				</view>
        			</template>
              <template v-slot:footer>
                <view class="footer">
                <view class="shop-price">
                	<text>¥</text>
                	<text class="shop-price-text">{{getPrice(item.goods_price,1)}}</text>
                	<text>.{{getPrice(item.goods_price,2)?getPrice(item.goods_price,2):'00'}}</text>
                </view>
                <view class="shopcat" @click.stop="cartBt(item)">
                  <uni-icons custom-prefix="iconfont" type="icon-gouwuche" size="18" color="#fff"></uni-icons>
                </view>
                </view>
              </template>
        		
        		</uni-list-item>
        	</uni-list>
        	<!-- 通过 loadMore 组件实现上拉加载效果，如需自定义显示内容，可参考：https://ext.dcloud.net.cn/plugin?id=29 -->
        	<uni-load-more v-if="loading || options.status === 'noMore' " :status="options.status" />
        </unicloud-db>
      </view>
    </view>
  </view>
</template>

<script>
import {mapMutations} from 'vuex'
import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins: [badgeMix],
    data() {
      return {
        swiperList:[//轮播图src
          {"image_src":"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/b6f990be-a0e8-43b8-b552-241c93422881.webp"},
          {"image_src":"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/deba0061-dbda-4acb-9c58-c6a40e981a5d.png"},
          {"image_src":"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/da257031-8612-4366-a714-5092ef2713b2.png"}
        ],
        // 条幅地址
        scroll_1:"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/40677583-5e9d-4f16-b415-65be52c4bd8b.png",
        scroll_2:"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/8a85c50d-353d-4d67-9eb8-12b49a3f405b.jpg",
        // 数据表名
        collection: 'opendb-mall-goods',
        // 查询字段，多个字段用 , 分割
        field: 'goods_thumb,name,goods_price,goods_desc,standard,remain_count,is_hot,is_new',
        formData: {
        	status: 'loading', // 加载状态
        },
        tipShow: false ,// 是否显示顶部提示框
        good_search:'鲜榴莲来啦~',
        isfocus:false,//搜索框是否获得焦点
        searchStyle:{
          top:'24px',
          right:'100px'
        }
        // search_top:0,
        // search_right:100,//搜索框距离边界距离
      };
    },
    onLoad(){//小程序页面刚加载时
      //获取胶囊信息
      let menuButtonObject = wx.getMenuButtonBoundingClientRect();
      this.searchStyle.top=menuButtonObject.top + 'px';
      //获取系统信息
      wx.getSystemInfo({
        success:res => {
          this.searchStyle.right=(res.screenWidth - menuButtonObject.left) + 'px'
        }
      })
    },
    onShow() {
      console.log("首页显示")
    },
    methods:{
      //把m_cart模块中的addToCart方法映射到当前页面使用
      ...mapMutations('m_cart',['addToCart']),
      focusSearch(){
        this.isfocus=true
      },
      search(res){
        uni.navigateTo({
          url: '/subpkg/goods_search/goods_search?search='+res.value
        })
      },
      load(data, ended) {
      	if (ended) {
      		this.formData.status = 'noMore'
      	}
      },
      // 将价格格式化
      getPrice(p,x){
        let price=(p/100).toFixed(2)
        if(x==1){
          return price.split('.')[0]
        }else{
          return price.split('.')[1]
        }
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
      }
      
    },
    /**
     * 上拉加载回调函数
     */
    onReachBottom() {
    	this.$refs.udb.loadMore()
    },
  }
</script>

<style lang="scss">
@import '@/common/uni-ui.scss';
.home{
  background-color: #fff;
}
 .good-search{
   position: fixed;
   top: 0px;
   left: 0;
   right: 0px;
   z-index: 5;
   opacity: 0.7;
   .uni-searchbar{
     padding: 0 10px;
     .uni-searchbar__box{
       height: 32px;
       
     }
   }
 }
 .focus-search{
   opacity: 1;
 }
swiper{
  height: 523rpx;
  
  .swiper-item,
  image{
    width: 100%;
    height: 100%;
  }
}
.scroll{
  // height: 27rpx;
  // padding: 10rpx;
  image{
    width: 100%;
    // height: 100%;
    border-radius: 20px;
  }
}
.goods-list{
  .top-img{
    height: 214rpx;
    width: 100%;
    margin-bottom:-5px ;
  }
  // .list-main{
  //   margin: 0 5rpx;
  //   background-color: #f9692d;
  // }
}


//
page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #efeff4;
		min-height: 100%;
		height: auto;
	}
  .item-outer{
    padding: 0 3px 3px;
  }
	.shop {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.shop-picture {
		width: 110px;
		height: 110px;
	}

	.shop-picture-column {
		width: 100%;
		height: 170px;
		margin-bottom: 5px;
	}

	.shop-price {
		font-size: 12px;
		color: #ff5a5f;
    display: inline-block;
	}

	.shop-price-text {
		font-size: 18px;
	} 
  .footer{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 5px 0;
    // background-color: #ff474a;
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
	.hot-tag {
		background: #289828;
		border: none;
		color: #fff;
    font-size: 24rpx;
	}
  .item-tag{
    border-color: #2ab030;
    color:#2ab030 ;
    background-color: #fff;
    font-size: 22rpx;
  }
	.button-box {
		height: 30px;
		line-height: 30px;
		font-size: 12px;
		background: #007AFF;
		color: #fff;
	}

	.uni-link {
		flex-shrink: 0;
	}
 .uni-title{
   margin-bottom: 0;
 }
 .uni-note{
   margin-top: 1px;
 }
	.ellipsis {
		display: flex;
		overflow: hidden;
	}

	.uni-ellipsis-1 {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.uni-ellipsis-2 {
    font-size: 14px;
    font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}


	// 默认加入 scoped ，所以外面加一层提升权重
	.list-main {
		.uni-list--waterfall {

			/* #ifndef H5 || APP-VUE */
			// 小程序 编译后会多一层标签，而其他平台没有，所以需要特殊处理一下
			::v-deep .uni-list {
			/* #endif */
				display: flex;
				flex-direction: row;
				flex-wrap: wrap;
				padding: 0 3px;
				box-sizing: border-box;
        background-color: #efefef;
				 
				/* #ifdef H5 || APP-VUE */
				// h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
				::v-deep
				/* #endif */
				  .uni-list-item--waterfall {
					width: 50%;
					box-sizing: border-box;
          background-color: #fff;
					.uni-list-item__container {
						display: flex;
            height: 302px;
            box-sizing: border-box;
						padding: 5px;
            padding-bottom: 0;
						flex-direction: column;
            justify-content: space-between;
					} 
					
				}

			/* #ifndef H5 || APP-VUE */
			}
			/* #endif */
		}
	}
</style>

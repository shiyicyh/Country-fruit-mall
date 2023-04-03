<template>
  <view>
    <!-- 轮播图区域 -->
    <swiper indicator-dots="true" indicator-active-color="#1830b8" autoplay="true" interval="3000" duration="1000" circular="true">
      <swiper-item v-for="(item,i) in swiperList" :key="i">
        <view class="swiper-item">
          <image :src="item.image_src"></image>
        </view>
      </swiper-item>
    </swiper>
    <!-- 轮播图区域结束 -->
    <!-- 公告栏区域 -->
    <uni-notice-bar show-icon scrollable color="#26ff26" background-color="#e7ffe5" 
    		text="uni-app 版正式发布，开发一次，同时发布iOS、Android、H5、微信小程序、支付宝小程序、百度小程序、头条小程序等7大平台。" />
    <!-- 横幅区域 -->
    
        <navigator url="/pages/my/my" open-type="switchTab">
          <view class="scroll">
           <image :src="scroll_1"></image>
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
         :field="field" @load="load">
        	<!-- 基于 uni-list 的页面布局 -->
        	<uni-list class="uni-list--waterfall">
        		<!-- to 属性携带参数跳转详情页面，当前只为参考 -->
        		<uni-list-item :border="false" class="uni-list-item--waterfall" title="自定义商品列表" v-for="item in data" :key="item._id" :to="'/pages/detail/detail?id='+item._id+'&title='+item.name">
              
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
        							<text class="uni-tag hot-tag">{{ item.goods_tip }}</text>
        							<text v-for="tag in item.tag" :key="tag" class="uni-tag item-tag">{{ tag }}</text>
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
                <view class="shopcat" @click="cartBt(item)">
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
          {"image_src":"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/9df9f664-2c7e-49d7-85f8-b9d27b960049.png"},
          {"image_src":"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/6cd6068c-9f01-4b99-a4dc-d0e845000e23.png"}
        ],
        // 条幅地址
        scroll_1:"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/0353223b-948c-45f3-bde6-ff9c705c51e1.png",
        scroll_2:"https://mp-630f25f8-3d11-4a15-8e06-595c473b679e.cdn.bspapp.com/cloudstorage/8a85c50d-353d-4d67-9eb8-12b49a3f405b.jpg",
        // 数据表名
        collection: 'opendb-mall-goods',
        // 查询字段，多个字段用 , 分割
        field: 'goods_thumb,name,goods_tip,tag,goods_price,goods_desc,standard,remain_count',
        formData: {
        	status: 'loading', // 加载状态
        },
        tipShow: false // 是否显示顶部提示框
      };
    },
    onLoad(){//小程序页面刚加载时
      // this.getSwiperList()
    },
    methods:{
      //把m_cart模块中的addToCart方法映射到当前页面使用
      ...mapMutations('m_cart',['addToCart']),
      
      load(data, ended) {
      	if (ended) {
      		this.formData.status = 'noMore'
      	}
      },
      // 将价格格式化
      getPrice(price,x){
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

 
swiper{
  height: 423rpx;
  
  .swiper-item,
  image{
    width: 100%;
    height: 100%;
  }
}
.scroll{
  height: 287rpx;
  padding: 10rpx;
  image{
    width: 100%;
    height: 100%;
    border-radius: 10px;
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
        background-color: #007AFF;
				 
				/* #ifdef H5 || APP-VUE */
				// h5 和 app-vue 使用深度选择器，因为默认使用了 scoped ，所以样式会无法穿透
				::v-deep
				/* #endif */
				  .uni-list-item--waterfall {
					width: 50%;
					box-sizing: border-box;
					.uni-list-item__container {
						display: flex;
						padding: 5px;
            padding-bottom: 0;
						flex-direction: column;
					} 
					
				}

			/* #ifndef H5 || APP-VUE */
			}
			/* #endif */
		}
	}
</style>

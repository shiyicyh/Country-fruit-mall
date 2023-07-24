<template>
	<view class="center">
		<view class="userInfo" @click.capture="toUserInfo">
			<cloud-image width="150rpx" height="150rpx" v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"></cloud-image>
			<view v-else class="defaultAvatarUrl">
				<uni-icons color="#ffffff" size="50" type="person-filled" />
			</view>
			<view class="logo-title">
				<text class="uer-name" v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
				<text class="uer-name" v-else>未登录</text>
			</view>
		</view>
    <view class="myOrder">
        <text >我的订单</text>
        <text class="text2" @click="tapGrid(-1)">全部 ></text>
    </view>
		<uni-grid class="grid" :column="4" :showBorder="false" :square="true">
			<uni-grid-item class="item" v-for="(item,index) in gridList" @click.native="tapGrid(index)" :key="index">
        <uni-badge class="uni-badge-left-margin" :text="item.badge" absolute="rightTop" size="small">
				  <uni-icons class="icon" color="#00ac02" custom-prefix="iconfont" :type="item.icon" size="24"></uni-icons>
				  <text class="text">{{item.text}}</text>
        </uni-badge>
			</uni-grid-item>
		</uni-grid>
		<uni-list class="center-list" v-for="(sublist , index) in ucenterList" :key="index">
			<uni-list-item v-for="(item,i) in sublist" :title="item.title" link :key="i"
				 :to="item.to" @click="ucenterListClick(item)" :show-extra-icon="true" :extraIcon="{type:item.icon,color:'#999'}">
			</uni-list-item>
		</uni-list>
	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL();
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
  import badgeMix from '@/mixins/tabbar-badge.js'
	export default {
    mixins: [badgeMix],
		data() {
			return {
				gridList: [{
						"text": "待支付",
						"icon": "icon-dingdandaifukuan",
            "badge":null
					},
					{
						"text": "待发货",
						"icon": "icon-bujifapiao",
            "badge":null
					},
					{
						"text": "待收货",
						"icon": "icon-pinglun",
            "badge":null
					},
					{
						"text": "待评价",
						"icon": "icon-dingdan",
            "badge":null
					}
				],
				ucenterList: [
					[{
						"title": "帮助中心",
						"to": '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
						"icon": "help"
					}, {
						"title": "问题与反馈",
						"to": '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
						"icon": "compose"
					}, {
						"title": "设置",
						"to": "/pages/ucenter/settings/settings",
						"icon": "gear"
					}]
				],
				listStyles: {
					"height": "150rpx", // 边框高度
					"width": "150rpx", // 边框宽度
					"border": { // 如果为 Boolean 值，可以控制边框显示与否
						"color": "#eee", // 边框颜色
						"width": "1px", // 边框宽度
						"style": "solid", // 边框样式
						"radius": "100%" // 边框圆角，支持百分比
					}
				}
			}
		},
		onLoad() {
      
		},
		onShow() {
      if(uniCloud.getCurrentUserInfo().tokenExpired < Date.now()){//token已过期
         uni.removeStorageSync('uni_id_token');
         uni.setStorageSync('uni_id_token_expired', 0)
         mutations.setUserInfo({},{cover:true})
      }
      if(this.hasLogin){
        this.getbadge()
      }else{
        for(let i=0;i<4;i++){
          this.gridList[i].badge=null
        }
        
      }
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin(){
				return store.hasLogin
			},
			appConfig() {
				return getApp().globalData.config
			}
		},
		methods: {
			/**
			 * 个人中心项目列表点击事件
			 */
			ucenterListClick(item) {
        console.log("点击列表")
        console.log(item)
				if (!item.to && item.event) {
					this[item.event]();
				}
			},
      async getbadge(){
        await db.collection('uni-pay-orders')
        .where("status != -2 && user_id ==$cloudEnv_uid")
        .get()
        .then((res)=>{
          console.log("获取订单信息")
          console.log(res)
          this.gridList[0].badge=res.data.filter(x => x.status==0).length
          this.gridList[1].badge=res.data.filter(x => x.status==1).length
          this.gridList[2].badge=res.data.filter(x => x.status==2).length
          this.gridList[3].badge=res.data.filter(x => x.status==3).length
          console.log("获取信息")
          console.log(this.gridList)
        }).catch((err)=>{
        	console.log(err);
        })
      },
			toUserInfo() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
				})
			},
			tapGrid(index) {
        // 未登录则跳转登录页
        if (!this.hasLogin) return this.delayNavigate()
        uni.navigateTo({
          url: '/subpkg/user_order/user_order?status=' + index
        })
			},
      // 延迟导航到 my 页面
      delayNavigate() {
        // 把 data 中的秒数重置成 3 秒
        this.seconds = 3
        this.showTips(this.seconds)
        this.timer = setInterval(() => {
          this.seconds--
          if (this.seconds <= 0) {
            clearInterval(this.timer)
            uni.navigateTo({
            	url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd'
            })
            return
          }
          this.showTips(this.seconds)
        }, 1000)
      },
      // 展示倒计时的提示消息
      showTips(n) {
        // 调用 uni.showToast() 方法，展示提示消息
        uni.showToast({
          // 不展示任何图标
          icon: 'none',
          // 提示的消息
          title: '请先登录！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5 秒后自动消失
          duration: 1500
        })
      },
    }
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}

	page {
		background-color: #f8f8f8;
	}
	/* #endif*/
	
	.center {
		flex: 1;
		flex-direction: column;
		background-color: #f8f8f8;
	}

	.userInfo {
		// padding: 20rpx;
		padding-top: 60px;
		background-image: url(../../static/uni-center/headers.png);
		flex-direction: column;
		align-items: center;
	}
	.defaultAvatarUrl{
		width: 150rpx;
		height: 150rpx;
		background-color: #6db46c;
		// border-radius: 100%;
		justify-content: center;
		align-items: center;
	}

	.logo-title {
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}

	.uer-name {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 38rpx;
		color: #FFFFFF;
	}
  .myOrder{
    display: flex;
    justify-content: space-between;
    align-items:center;
    flex-direction: row;
    padding: 0px 8px;
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    background-color: #ffffff;
    .text2{
      font-size: 12px;
      color: #a8a8a8;
      text-align: right;
      width: 45px;
      padding: 10px 0;
    }
  }
  
	.center-list {
		margin-bottom: 30rpx;
		background-color: #f9f9f9;
	}

	.center-list-cell {
		width: 750rpx;
		background-color: #007AFF;
		height: 40rpx;
	}

	.grid {
		background-color: #FFFFFF;
		margin-bottom: 6px;
    // .uni-grid-item{
    //   height: 20vw !important;
    //   // align-items: center;
    // }
	}

	.uni-grid .text {
		font-size: 14px;
		height: 25px;
		line-height: 25px;
		color: #817f82;
	}
	.uni-grid .item ::v-deep .uni-grid-item__box {
		justify-content: center;
		align-items: center;
    height: 100%;
	}


	/*修改边线粗细示例*/
	/* #ifndef APP-NVUE */
	.center-list ::v-deep .uni-list--border:after {
		-webkit-transform: scaleY(0.2);
		transform: scaleY(0.2);
		margin-left: 80rpx;
	}

	.center-list ::v-deep .uni-list--border-top,
	.center-list ::v-deep .uni-list--border-bottom {
		display: none;
	}

	/* #endif */
	.item-footer {
		flex-direction: row;
		align-items: center;
	}

	.item-footer-text {
		color: #999;
		font-size: 24rpx;
		padding-right: 10rpx;
	}

	.item-footer-badge {
		width: 20rpx;
		height: 20rpx;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 10rpx;
		/* #endif */
		background-color: #DD524D;
	}
</style>
<style>
  .uni-grid-item{
    height: 18.66vw !important;
    /* // align-items: center; */
  }
  .uni-badge--x {
    display: flex !important;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
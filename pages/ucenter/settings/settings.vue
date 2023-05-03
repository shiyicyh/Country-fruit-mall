<template>
	<view class="content">
		<!-- 功能列表 -->
		<uni-list class="mt10" :border="false">
			<uni-list-item title="账号资料" to="/uni_modules/uni-id-pages/pages/userinfo/userinfo" link="navigateTo"></uni-list-item>
		</uni-list>

		<!-- 退出/登录 按钮 -->
		<view class="bottom-back" @click="changeLoginState">
			<text class="bottom-back-text" v-if="hasLogin">退出登录</text>
			<text class="bottom-back-text" v-else>登录</text>
		</view>
	</view>
</template>

<script>
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		data() {
			return {
			}
		},
		computed: {
			hasLogin(){
				return store.hasLogin
			},
		},
		methods: {
			async changeLoginState(){
				if(this.hasLogin){
					await mutations.logout()
				}else{
					uni.redirectTo({
						url: '/uni_modules/uni-id-pages/pages/login/login-withoutpwd',
					});
				}
			},
		}
	}
</script>

<style>
	/* #ifndef APP-NVUE */
	page {
		flex: 1;
		width: 100%;
		height: 100%;
	}

	uni-button:after {
		border: none;
		border-radius: 0;
	}
	/* #endif */
	.content {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 750rpx;
		height: 100vh;
		/* #endif */
		flex-direction: column;
		flex: 1;
		background-color: #F9F9F9;
	}

	.bottom-back {
		margin-top: 10px;
		width: 750rpx;
		height: 44px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		justify-content: center;
		align-items: center;
		/* #ifndef APP-NVUE */
		border: none;
		/* #endif */
		border-width: 0;
		border-radius: 0;
		background-color: #FFFFFF;
	}

	.bottom-back-text {
		font-size: 33rpx;
	}

	.mt10 {
		margin-top: 10px;
	}
	/* #ifndef APP-NVUE  || VUE3 */
	.content ::v-deep .uni-list {
		background-color: #F9F9F9;
	}
	.content ::v-deep .uni-list-item--disabled,.list-item {
		height: 50px;
		margin-bottom: 1px;
	}
	/* #endif */

</style>
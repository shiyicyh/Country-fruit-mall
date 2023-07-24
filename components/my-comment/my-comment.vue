<template>
	<view class="my-comment">
		<view class="header">
			<view class="header-left">
				<view class="username" v-if="!ifmy">{{info.user_name}}</view>
				<view class="rate">
					<uni-rate :readonly="true" :value="info.rate_count" size="18"/>
				</view>
			</view>
			<view class="header-right">{{info.comment_date | timestampToTime}}</view>
		</view>
		<view class="container">
			<view class="text">{{info.comment_content?info.comment_content:'未填写内容'}}</view>
			<view class="img" v-if="info.comment_img && !ifdetail">
        <c-image :value="info.comment_img.length==1?info.comment_img[0]:info.comment_img" disabled="true" :imageNumber="info.comment_img.length" isWrap="true"></c-image>
				<!-- <image v-for="(src,i) in info.comment_img" :key="i" :src="src" mode="aspectFit"></image> -->
			</view>
		</view>
		<view class="goodinfo" v-if="ifmy">
			<image :src="info.good_id[0].goods_thumb" mode="aspectFill"></image>
			<view class="title">{{info.good_id[0].name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-comment",
		props:{
			info:{
			  type:Object,
			  default:{},
			},
			ifmy:{//是否为我的评价
			  type:Boolean,
			  default:false,//默认不是
			},
      ifdetail:{//是否为商品详情页
        type:Boolean,
        default:false,//默认不是
      }
		},
		data() {
			return {
				
			};
		},
	}
</script>

<style lang="scss">
.my-comment{
	box-sizing: border-box;
	width: 100%;
	margin: 7px 0;
	padding: 10px;
	border-radius: 10px;
	background-color: #ffffff;
	.header{
		display: flex;
		justify-content: space-between;
		align-items: center;
		.header-left{
			font-size: 16px;
			color: #000;
		}
		.header-right{
			font-size: 14px;
			color: #8f8f8f;
		}
	}
	.container{
    .text{
      padding: 7px 0;
    }
		.img{
			// display: flex;
			// image{
			// 	width: 26.67vw;
			// 	height: 26.67vw;
			// }
		}
	}
	.goodinfo{
		background-color: #ebebeb;
		display: flex;
		align-items: center;
    margin-top: 7px;
		image{
			width: 10.66vw;
			height: 10.66vw;
		}
		.title{
			font-size: 12px;
			padding-left: 10px;
		}
	}
}
</style>
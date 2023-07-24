<template>
	<view class="cloud-image">
		<view class="cloud-image__content">
			<block v-if="imageNumber==1">
				<view class="flex justify-between">
					<text class="text-black">{{title}}</text>
					<text class="text-sm margin-left-sm text-gray">{{tips}}</text>
				</view>
				<view class="">
					<image v-if="val" :src="val" mode="aspectFill" class="image" :style="imageSizeStyle"
						@click="upload(0)"></image>
					<uni-icons v-if="isShowIcon" class="content-image-icon" :type="suffixIcon" :size="iconSize"
						color="#c0c4cc" @click="upload()"></uni-icons>
					<uni-icons v-else-if="!disabled" class="image-delete" type="trash" size="20" color="#ff0000"
						@click="del(0)">
					</uni-icons>
				</view>
			</block>
			<block v-else>
				<view class="flex justify-between">
					<view class="">
						<text class="text-black">{{title}}</text>
						<text class="text-sm margin-left-sm text-gray">{{tips}}</text>
					</view>
					<text v-if="!disabled">{{srcList.length}}/{{imageNumber}}</text>
				</view>
				<view class="wrap-imgs" v-if="isWrap">
					<view v-for="(item,index) in srcList" :key="index" class="scroll-view-item_H">
						<image :src="item" mode="aspectFill" class="image" :style="imageSizeStyle"
							@click="previewImage(index)"></image>
						<uni-icons v-if="!disabled" class="image-delete" type="trash" size="20" color="#ff0000"
							@click="del(index)">
						</uni-icons>
					</view>
					<uni-icons v-if="isShowIcon" class="scroll-view-item_H content-image-icon" :type="suffixIcon"
						:size="iconSize" color="#c0c4cc" @click="upload()"></uni-icons>
				</view>
				<scroll-view v-else class="scroll-view_H" scroll-x="true">
					<view class="scroll-view_H2">
						<view v-for="(item,index) in srcList" :key="index" class="scroll-view-item_H">
							<image :src="item" mode="aspectFill" class="image" :style="imageSizeStyle"
								@click="previewImage(index)"></image>
							<uni-icons v-if="!disabled" class="image-delete" type="trash" size="20" color="#ff0000"
								@click="del(index)">
							</uni-icons>
						</view>
						<uni-icons v-if="isShowIcon" class="scroll-view-item_H content-image-icon" :type="suffixIcon"
							:size="iconSize" color="#c0c4cc" @click="upload()"></uni-icons>
					</view>
				</scroll-view>
			</block>
		</view>
	</view>
</template>

<script>
	/**
	 * 云上商城图片上传组件
	 * @alias https://ext.dcloud.net.cn/plugin?id=3647
	 * @property {String} name  上传文件前缀
	 * @property {String} title  提示标题
	 * @property {String} tips  提示说明
	 * @property {String,Array} value 变量，可以是字符串或者数组
	 * @property {String} suffixIcon  默认图标
	 * @property {Number} imageNumber  上传文件数量，默认1
	 * @property {String} size  文件显示尺寸，宽x高，例如：300x200
	 * @property {Boolean} isHold  是否可用一直上传
	 *
	 */
	export default {
		name: 'cloud-image',
		data() {
			return {
				val: "",
				srcList: [],
			};
		},
		props: {
			name: {
				type: String,
				default: 'image'
			},
			title: {
				type: String,
				default: ''
			},
			tips: {
				type: [String, Number],
				default: ''
			},
			value: [Number, String, Array],
			suffixIcon: {
				type: String,
				default: 'plusempty'
			},
			imageNumber: {
				type: Number,
				default: 1
			},
			size: {
				type: String,
				default: ''
			},
			iconSize: {
				type: Number,
				default: 40
			},
			isWrap: {
				type: Boolean,
				default: false
			},
			isHold: {
				type: Boolean,
				default: false
			},
			disabled: {
				type: Boolean,
				default: false
			},
		},
		watch: {
			value(newVal) {
				if (typeof newVal == "object" && newVal) {
					this.srcList = newVal
				} else {
					this.val = newVal
				}
				if (this.formItem) {
					this.formItem.setValue(newVal)
				}
			}
		},
		computed: {
			isShowIcon() {
				if (this.disabled) {
					return false;
				}
				if (!this.suffixIcon) {
					return false;
				}
				if (this.isHold) {
					return true;
				}
				if (this.imageNumber > 1) {
					return this.imageNumber - this.srcList.length > 0;
				}
				return !this.val;
			},
			imageSizeStyle() {
				if (this.size) {
					let strarr = this.size.split("x");
					if (strarr.length == 1) {
						strarr.push(strarr[0]);
					}
					return `width:${strarr[0]}rpx;height:${strarr[1]}rpx;`
				}
				return ""
			}
		},
		created() {
			console.log(typeof this.value)
			if (typeof this.value == "object" && this.value) {
				this.srcList = this.value
			} else {
				this.val = this.value
			}
			//this.val = this.value
			this.form = this.getForm('uniForms')
			this.formItem = this.getForm('uniFormsItem')
			if (this.formItem) {
				if (this.formItem.name) {
					this.rename = this.formItem.name
					this.form.inputChildrens.push(this)
				}
			}
		},
		methods: {
			/**
			 * 初始化变量值
			 */
			init() {

			},
			/**
			 * 获取父元素实例
			 */
			getForm(name = 'uniForms') {
				let parent = this.$parent;
				let parentName = parent.$options.name;
				while (parentName !== name) {
					parent = parent.$parent;
					if (!parent) return false;
					parentName = parent.$options.name;
				}
				return parent;
			},
			uploadCallback(srcs) {
				if (this.imageNumber == 1) {
					this.val = srcs[0]
					this.$emit('input', this.val);
				} else {
					this.srcList = this.srcList.concat(srcs)
					this.$emit('input', this.srcList);
				}

			},
			del(index) {
				if (this.imageNumber == 1) {
					this.val = ""
					this.$emit('input', this.val);
				} else {
					this.srcList.splice(index, 1)
					this.$emit('input', this.srcList);
				}
			},
			previewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.srcList.length>0?this.srcList:this.val
				});
			},
			upload() {
				if (this.disabled) {
					this.previewImage(0)
          console.log("查看大图")
					return false;
				}
				let dt = new Date();
				uni.chooseImage({
					count: this.imageNumber - this.srcList.length,
					success: res => {
						let paths = [];
						console.log(res)
						//this.uploadCallback(res.tempFilePaths);
						let promises = [];
						uni.showLoading({
							title: "图片上传中"
						})
						//循环上传
						res.tempFilePaths.map((filePath, index) => {
							let names = ["jpg"];
							console.log(res.tempFiles[index])
							if (res.tempFiles[index].name && res.tempFiles[index].name.indexOf(".") >
								0) {
								names = res.tempFiles[index].name.split(".");
							} else if (res.tempFiles[index].path && res.tempFiles[index].path.indexOf(
									".") > 0) {
								names = res.tempFiles[index].path.split(".");
							}
							let fname = (Math.random() + '').substr(2) + "." + names[names.length - 1];
							let cpath = this.name + '/' + fname;
							let uploadPromise = cloudUploadFile(filePath, cpath, index);
							promises.push(uploadPromise)
						})
						Promise.all(promises).then(res => {
							console.log(res);
							uni.hideLoading();
							this.uploadCallback(res);
						});
					}
				});

				function cloudUploadFile(filePath, cpath, index) {
					return new Promise((resolve, reject) => {
						let result = uniCloud.uploadFile({
							filePath: filePath,
							cloudPath: cpath,
							onUploadProgress: pro => {},
							success: res => {
								console.log("cloudUploadFile", res)
								if (res.fileID.indexOf("cloud://") != -1) {
									//用这个转换一下，有一个隐藏的好处，可以等待文件发布到cdn，避免立即访问不到
									uniCloud.getTempFileURL({
										fileList: [res.fileID]
									}).then(res2 => {
										resolve(res2.fileList[0].tempFileURL);
									})
								} else {
									//延时返回，可以等待文件发布到cdn，避免立即访问不到
									setTimeout(() => {
										resolve(res.fileID);
									}, 200);
								}
							},
							fail: () => {
								reject(false);
							}
						});
					});
				};
			}
		}
	}
</script>

<style lang="scss">
	.cloud-image {
		width: 100%;
		overflow: auto;
	}

	.image {
		width: 140rpx;
		height: 140rpx;
		border-radius: 10rpx;
	}

	.scroll-view_H {
		white-space: nowrap;
		flex-wrap: wrap;
		width: 100%;
	}

	.scroll-view-item_H {
		display: inline-block;
		width: 140rpx;
		height: 140rpx;
		text-align: center;
		margin-right: 16rpx;
		position: relative;
		// border: 1upx solid #3e3e3e;
		border-radius: 10rpx;
		margin-bottom: 12rpx;

		.image-delete {
			position: absolute;
			right: 0rpx;
			top: 0rpx;
			line-height: 1;
			padding: 10rpx;
			background: #fff;
			border-radius: 0 10rpx 0 10px;
		}
	}

	.wrap-imgs {
		display: flex;
		flex-wrap: wrap;
	}

	.content-image-icon {
		line-height: 140rpx;
    border: 1upx solid #3e3e3e;
	}

	.scroll-view_H2 {
		display: flex;
		align-items: center;
	}

	.result {
		text-align: right;
	}

	.text-gray {
		color: #b4b4b4;
	}
</style>

import pagesJson from '@/pages.json'
import config from '@/uni_modules/uni-id-pages/config.js'
import _store from '@/store/index.js'

const uniIdCo = uniCloud.importObject("uni-id-co")
const db = uniCloud.database();
const usersTable = db.collection('uni-id-users')

let hostUserInfo = uni.getStorageSync('uni-id-pages-userInfo')||{}
// console.log( hostUserInfo);
const data = {
	userInfo: hostUserInfo,
	hasLogin: Object.keys(hostUserInfo).length != 0
}

// console.log('data', data);
// 定义 mutations, 修改属性
export const mutations = {
	// data不为空，表示传递要更新的值(注意不是覆盖是合并),什么也不传时，直接查库获取更新
	async updateUserInfo(data = false) {
		if (data) {
			usersTable.where('_id==$env.uid').update(data).then(e => {
				// console.log(e);
				if (e.result.updated) {
					uni.showToast({
						title: "更新成功",
						icon: 'none',
						duration: 3000
					});
					this.setUserInfo(data)
				} else {
					// uni.showToast({
					// 	title: "没有改变",
					// 	icon: 'none',
					// 	duration: 3000
					// });
				}
			})

		} else {
			const uniIdCo = uniCloud.importObject("uni-id-co", {
				customUI: true
			})
			try {
				let res = await usersTable.where("'_id' == $cloudEnv_uid")
					.field('mobile,nickname,username,email,avatar_file')
					.get()

				const realNameRes = await uniIdCo.getRealNameInfo()

				console.log('fromDbData',res.result.data);
				this.setUserInfo({
					...res.result.data[0],
					realNameAuth: realNameRes
				})
			} catch (e) {
				this.setUserInfo({},{cover:true})
				console.error(e.message, e.errCode);
			}
		}
	},
	async setUserInfo(data, {cover}={cover:false}) {
		// console.log('set-userInfo', data);
		let userInfo = cover?data:Object.assign(store.userInfo,data)
		store.userInfo = Object.assign({},userInfo)
		store.hasLogin = Object.keys(store.userInfo).length != 0
		// console.log('store.userInfo', store.userInfo);
		uni.setStorageSync('uni-id-pages-userInfo', store.userInfo)
		return data
	},
  
  async downloadCart(){
    try {
      //获取云端购物车并保存
      const cart = db.collection('my_cart').where("user_id == $cloudEnv_uid").field('good_id,good_count,good_state').getTemp() // 临时表
      const good = db.collection('opendb-mall-goods').field('_id,name,goods_price,standard,goods_thumb,remain_count').getTemp() // 临时表
      let storeCart=[]
      await db.collection(cart, good) //获取联表
        .get()
        .then(res => {
          //直接将云端购物车同步到本地
           _store.commit('m_cart/addToCart',res.result.data)
        }).catch(err => {
          console.error(err)
      })

    } catch (e) {
    	console.error(e.message, e.errCode);
    }
  },
  async uploadCart(data){
    //将本地购物车上传到云端
      let addGoods=[]//待添加的商品数组
      for(let i=0;i<data.length;i++){
        let where="good_id == '"+data[i].goods_id +"' && 'user_id' == $cloudEnv_uid"
        await db.collection('my_cart').where(where).get().then(res=>{
          if(res.result.data.length>0){//云端购物车存在该商品，直接更新数量
            db.collection('my_cart').where(where).update({good_count:data[i].goods_count,good_state:data[i].goods_state}).then( res =>{console.log(res)})
          }else{//不存在该商品,先保存再一次性添加
            let goods={
              good_count:data[i].goods_count,
              good_state:data[i].goods_state,
              good_id:data[i].goods_id
            }
            addGoods.push(goods)
          }
        })
      }
      //将保存好的本地购物车上传到云端
      if(addGoods.length>0){
        db.collection('my_cart').add(addGoods).then( res =>{
        })
      }
  },
  
	async logout() {
    await this.uploadCart(_store.state.m_cart.cart)
		// 1. 已经过期就不需要调用服务端的注销接口	2.即使调用注销接口失败，不能阻塞客户端
		if(uniCloud.getCurrentUserInfo().tokenExpired > Date.now()){
			try{
				await uniIdCo.logout()
			}catch(e){
				console.error(e);
			}
		}
		uni.removeStorageSync('uni_id_token');
		uni.setStorageSync('uni_id_token_expired', 0)
    _store.commit('m_cart/resetStatecart')
    // uni.setStorageSync('cart',JSON.stringify('[]'))
    // uni.removeStorageSync('cart')
		// uni.redirectTo({
		// 	url: `/${pagesJson.uniIdRouter?.loginPage ?? 'uni_modules/uni-id-pages/pages/login/login-withoutpwd'}`,
		// });
		uni.$emit('uni-id-pages-logout')
		this.setUserInfo({},{cover:true})
    
	},

	loginBack (e = {}) {
		const {uniIdRedirectUrl = ''} = e
		let delta = 0; //判断需要返回几层
		let pages = getCurrentPages();
		// console.log(pages);
		pages.forEach((page, index) => {
			if (pages[pages.length - index - 1].route.split('/')[3] == 'login') {
				delta++
			}
		})
		// console.log('判断需要返回几层:', delta);
		if (uniIdRedirectUrl) {
			return uni.redirectTo({
				url: uniIdRedirectUrl,
				fail: (err1) => {
					uni.switchTab({
						url:uniIdRedirectUrl,
						fail: (err2) => {
							console.log(err1,err2)
						}
					})
				}
			})
		}
		// #ifdef H5
		if (e.loginType == 'weixin') {
			// console.log('window.history', window.history);
			return window.history.go(-3)
		}
		// #endif

		if (delta) {
			const page = pagesJson.pages[0]
			return uni.reLaunch({
				url: `/${page.path}`
			})
		}

		uni.navigateBack({
			delta
		})
	},
	async loginSuccess(e = {}){
		const {
			 autoBack = true, uniIdRedirectUrl = '', passwordConfirmed
		} = e
    
		// console.log({toastText,autoBack});
			await uni.showToast({
				title: '登录成功',
				icon: 'none',
				duration: 1500
			});
    await this.downloadCart()
		this.updateUserInfo()//初始化本地用户信息
    
    // _store.commit('m_cart/getStatecart')
    if(!store.userInfo.nickname){//若用户首次登录
      this.updateUserInfo({nickname:"果几用户"})//将用户昵称更改为默认昵称
    }
    
		uni.$emit('uni-id-pages-login-success')

		// if (config.setPasswordAfterLogin && !passwordConfirmed) {
		// 	return uni.redirectTo({
		// 		url: uniIdRedirectUrl ? `/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd?uniIdRedirectUrl=${uniIdRedirectUrl}&loginType=${e.loginType}`: `/uni_modules/uni-id-pages/pages/userinfo/set-pwd/set-pwd?loginType=${e.loginType}`,
		// 		fail: (err) => {
		// 			console.log(err)
		// 		}
		// 	})
		// }

		if (autoBack) {
			this.loginBack({uniIdRedirectUrl})
		}
	}

}

// #ifdef VUE2
import Vue from 'vue'
// 通过Vue.observable创建一个可响应的对象
export const store = Vue.observable(data)
// #endif

// #ifdef VUE3
import {
	reactive
} from 'vue'
// 通过Vue.observable创建一个可响应的对象
export const store = reactive(data)
// #endif

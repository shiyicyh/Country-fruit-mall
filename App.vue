<script>
	import uniIdPageInit from '@/uni_modules/uni-id-pages/init.js';
	export default {
  globalData: {  
    order_detail: {},
    order_goods:[]
  },  
	onLaunch: async function() {
	console.log('App Launch')
	await uniIdPageInit()
},
	onShow: function() {
	console.log('App Show')
},
	onHide: function() {
	console.log('App Hide')
}
}
</script>

<style>
	/*每个页面公共css */
  @import "@/static/iconfont.css";
</style>

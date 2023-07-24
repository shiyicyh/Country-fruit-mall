<template>
	<view class="comment-list">
		<block v-for="(item,i) in List" :key="i">
			<my-comment :info="item" :ifmy="ifmy"></my-comment>
		</block>
	</view>
</template>

<script>
	const db = uniCloud.databaseForJQL();
	export default {
		data() {
			return {
				List:[],
				ifmy:false,//是否为我的评价页面
        goods_id:''
			};
		},
		onLoad(e){
      console.log("收到的数据")
      console.log(e)
      if(e.ifmy){
        this.ifmy=e.ifmy
      }
      if(e.good_id){
        this.good_id=e.good_id
      }
			this.getList()
		},
		methods:{
			getList(){
				let where=''
				if(this.ifmy){
					where="status != -2 && user_id ==$cloudEnv_uid" //显示当前用户所有评价
				}else{
					where="status == 1 && good_id=='"+this.good_id+"'" //只显示当前商品已审核通过的订单
				}
				console.log(where)
				const comment = db.collection('goods-comments').where(where).orderBy('comment_date desc').getTemp() // 注意结尾的方法是getTemp，对order表过滤得到临时表
				const goods = db.collection('opendb-mall-goods').field('_id,name,goods_thumb').getTemp()
				db.collection(comment,goods) // 注意collection方法内需要传入所有用到的表名，用逗号分隔，主表需要放在第一位 // 查询order表内书名为“三国演义”的订单
				  .get()
				  .then(res => {
					  console.log("评论联表结果")
				      console.log(res);
					  this.List=res.data
				  }).catch(err => {
				    console.error(err)
				  })
			}
		}
	}
</script>

<style lang="scss">
.comment-list{
  background-color: #ebebeb;
  min-height: 100vh;
  padding:7px;
}
</style>

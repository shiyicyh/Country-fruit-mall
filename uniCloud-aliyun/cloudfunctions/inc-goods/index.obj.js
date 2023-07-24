// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
     const db = uniCloud.database();
     const dbCmd = db.command
module.exports = {
	_before: function () { // 通用预处理器
	},
   async updateGood(good_id,buynum) {
     try{
          const res=await db.collection('opendb-mall-goods').doc(good_id).update({remain_count:dbCmd.inc(-buynum),total_sell_count:dbCmd.inc(buynum)}).get()
        }catch(e){
          console.log("云对象内部错误")
          return e
        }
    },
    async updateGoodComment(good_id) {
      try{
           const res=await db.collection('opendb-mall-goods').doc(good_id).update({comment_count:dbCmd.inc(1)}).get()
         }catch(e){
           console.log("云对象内部错误")
           return e
         }
     }
	/**
	 * method1方法描述
	 * @param {string} param1 参数1描述
	 * @returns {object} 返回值描述
	 */
	/* 
	method1(param1) {
		// 参数校验，如无参数则不需要
		if (!param1) {
			return {
				errCode: 'PARAM_IS_NULL',
				errMsg: '参数不能为空'
			}
		}
		// 业务逻辑
		
		// 返回结果
		return {
			param1 //请根据实际需要返回值
		}
	}
	*/
}

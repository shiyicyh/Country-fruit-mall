import { mapGetters } from 'vuex'

// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      //uni.setTabBarBadge() 方法的text不能超过3个半角字符
      if(this.total>99){
        uni.setTabBarBadge({
          index: 2,
          text: 99 + '+', 
        })
      }else{
        uni.setTabBarBadge({
          index: 2,
          text: this.total + '', // 注意：text 的值必须是字符串，不能是数字
        })
      }
    },
  },
}
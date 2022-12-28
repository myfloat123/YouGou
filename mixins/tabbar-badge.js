// 除了要在 cart.vue 页面中设置购物车的数字徽标，还需要在其它 3 个 tabBar 页面中，为购物车设置数字徽标。
// 此时可以使用 Vue 提供的 mixins 特性，提高代码的可维护性。
import { mapGetters } from 'vuex'
// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total'])
  },
  // 页面一加载的时候调用onShow()生命周期函数
  onShow() {
    // 在页面刚展示的时候，设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 如果购物车的商品总数为0，移除购物车tabbar的徽标
      if(this.total === 0) return this.removeBadge()
      // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
      uni.setTabBarBadge({
        index: 2, // 索引，指定为哪一个tabbar设置徽标
        text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
      })
    },
    removeBadge() {
      uni.removeTabBarBadge({
        index: 2
      })
    }
  },
  watch: {
    total: {
      // 监听购物车总数total的变化
      handler(newVal) {
        // console.log(newVal);
        this.setBadge() // 监听total的变化设置购物车tabbar的徽标
      },
      immediate: true
    }
  }
}
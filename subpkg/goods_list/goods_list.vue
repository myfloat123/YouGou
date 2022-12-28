<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods,i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          query: '',
          cid: '',
          pagenum: 1,
          pagesize: 10
        },
        goodsList: [],
        total: 0,
        isLoading: false
      };
    },
    onLoad(options) {
      console.log(options);
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      console.log(this.queryObj); 
      this.getGoodsList()
    },
    methods: {
      async getGoodsList(cb) {
        // 打开节流阀，开始请求数据
        this.isLoading = true
        const { data: res } = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        // 关闭节流阀，数据请求完成后
        this.isLoading = false
        cb && cb() // 下拉刷新请求数据完成后，吐过外界传递了关闭下拉刷新的回调函数，就执行关闭下拉刷新
        if(res.meta.status !== 200) return uni.$showMsg()
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      gotoDetail(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },
    onReachBottom() {
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      // 判断上一页是否正在请求数据，如果上一页的数据还没请求完成，后面多次频繁触发的事件就会被忽略
      if(this.isLoading) return
      // 让页码值自增+1
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      
      // 重新发起数据请求，下拉刷新请求数据完成后要关闭下拉刷新
      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">

</style>

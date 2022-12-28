<template>
  <!-- 在商品详情数据请求回来之前，data 中 goods_info 的值为 {}，因此初次渲染页面时，会导致 商品价格、商品名称 等闪烁的问题。 -->
  <!-- 判断 goods_info.goods_name 属性的值是否存在，从而使用 v-if 指令控制页面的显示与隐藏 -->
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>

    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品的价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 商品的信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品的名字 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费区域 -->
      <view class="yf">快递：免运费</view>
    </view>

    <!-- 在页面结构中，使用 rich-text 组件，将带有 HTML 标签的内容，渲染为小程序的页面结构 -->
    <!-- 通过动态绑定nodes节点渲染HTML结构 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>

    <!-- 商品导航组件区域 -->
    <view class="goods_nav">
      <uni-goods-nav :options="options" :fill="true" :button-group="buttonGroup" @click="onClick"
        @buttonClick="buttonClick" />
    </view>
  </view>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapState('m_cart', ['cart']),
      ...mapGetters('m_cart', ['total'])
    },
    watch: {
      // 页面首次加载完毕后，不会调用这个侦听器
      // 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
      // total(newVal) {
      //   // 2. 通过数组的 find() 方法，找到购物车按钮的配置对象
      //   const findResult = this.options.find(x => x.text === '购物车')
      //   if(findResult) {
      //     // 3. 动态为购物车按钮的 info 属性赋值
      //     findResult.info = newVal
      //   }
      // }
      
      // 定义 total 侦听器，指向一个配置对象
      total: {
        // handler 属性用来定义侦听器的 function 处理函数
        handler(newVal) {
          const findResult = this.options.find(x => x.text === '购物车')
            if(findResult) {
              findResult.info = newVal
            }
        },
        // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
        immediate: true
      }
    },
    data() {
      return {
        goods_info: [],
        options: [{
          icon: 'shop',
          text: '店铺',
          infoBackgroundColor: '#007aff',
          infoColor: "#f5f5f5"
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        buttonGroup: [{
            text: '加入购物车',
            backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
            color: '#fff'
          },
          {
            text: '立即购买',
            backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
            color: '#fff'
          }
        ],
      };
    },
    onLoad(options) {
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    methods: {
      ...mapMutations('m_cart', ['addToCart']),
      async getGoodsDetail(goods_id) {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/detail', {
          goods_id
        })
        if (res.meta.status !== 200) return uni.$showMsg()

        // 通过正则匹配到 <img ，进行<img style="display:block;" 全局替换，解决图片之间的空白间隙问题; webp格式的图片在ios设备上无法显示，通过正则的方式将后缀名为webp的图片替换为jpg格式的图片
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"')
          .replace(/webp/g, 'jpg')

        this.goods_info = res.message
        // <img style=\"display:block;\"data-src=\"//image.suning.cn/uimg/sop/commodity/966602987133443585157120_x.jpg?from=mobile&format=80q.webp\" alt=\"\" src=\"//image.suning.cn/uimg/sop/commodity/966602987133443585157120_x.jpg?from=mobile&format=80q.webp\" width=\"100%\" height=\"auto\">
      },
      preview(i) {
        // 点击轮播图的图片进行预览
        uni.previewImage({
          current: i,
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      // 左侧点击事件
      onClick(e) {
        // console.log(e);
        if(e.content.text === '购物车') {
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      // 右侧按钮组点击事件
      buttonClick(e) {
        // console.log(e)
        // 1. 判断是否点击了 加入购物车 按钮
        if(e.content.text === '加入购物车') {
          // 组织商品的信息对象
          // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
          const goods = {
            goods_id: this.goods_info.goods_id, // 商品的Id
            goods_name: this.goods_info.goods_name, // 商品的名称
            goods_price: this.goods_info.goods_price, // 商品的价格
            goods_count: 1,                           // 商品的数量
            goods_small_logo: this.goods_info.goods_small_logo, // 商品的图片
            goods_state: true                                   // 商品的勾选状态
          }
          
          // 3. 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
          // 调用addToCart方法
          this.addToCart(goods)
        }
      }
    }
  }
</script>

<style lang="scss">
  swiper {
    height: 750rpx;

    image {
      width: 100%;
      height: 100%;
    }
  }

  .goods-info-box {
    padding: 10px;
    padding-right: 0;

    .price {
      color: #c00000;
      font-size: 18px;
      margin: 10px 0;
    }

    .goods-info-body {
      display: flex;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
        margin-right: 10px;
      }

      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }

    .yf {
      font-size: 12px;
      color: gray;
      margin: 10px 0;
    }
  }

  .goods_nav {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .goods-detail-container {
    padding-bottom: 50px;
  }
</style>

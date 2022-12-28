<template>
  <view class="login-container">
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    <text class="tip-text">登录后尽享更多权益</text>
  </view>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  export default {
    name: "my-login",
    data() {
      return {

      };
    },
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      // 用户授权之后，获取用户的基本信息
      getUserProfile() {
        uni.getUserProfile({
          desc: '你的授权信息',
          success: (res) => {
            // console.log(res);
            // 将信息存到vuex中
            this.updateUserInfo(res.userInfo)
            this.getToken(res)
          },
          fail: (res) => {
            // console.log(res);
            // if(res.errMsg === 'getUserProfile:fail auth deny')
            return uni.$showMsg('您取消了登录授权')
          }
        })
      },
      async getToken(info) {
        // 获取code对应的值
        const [err, res] = await uni.login().catch(err => err)
        // console.log(res);
        if(err || res.errMsg !== 'login:ok') return uni.$showMsg('登录失败！')
        // console.log(res.code);
        // console.log(info);
        // 准备请求参数
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
        // console.log(query);
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log(loginResult);
        	
        if(loginResult.meta.status !== 400) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功！')
        // 直接把token 保存到vuex中
        // this.updateToken(loginResult.message.token)
        this.updateToken('fade-token') // 这里涉及权限问题，传一个假token方便后面学习
        this.navigateBack()
      },
      navigateBack() {
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: () => {
              // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .login-container {
    height: 750rpx;
    background-color: #f8f8f8;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;

    &::after {
      content: ' ';
      display: block;
      width: 100%;
      height: 40px;
      background-color: white;
      position: absolute;
      bottom: 0;
      left: 0;
      border-radius: 100%;
      transform: translateY(50%);
    }

    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;
    }

    .tip-text {
      font-size: 12px;
      color: gray;
    }
  }
</style>

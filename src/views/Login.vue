<template>
  <div class="login-page bg-teal-9">
    <div
      class="tm-link"
      style="
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 30px;
        color: #ffffff;
        line-height: 30px;
      "
      @click="tool.hideLogin()"
    >
      <Icon class="mdi-close"></Icon>
    </div>
    <div class="login-box bg-teal-5 pd-20">
      <div class="login-left">
        <div class="ft-25 pdtb-10 pdlr-20">Team IDE</div>
        <p class="ft-15 pdtb-5 pdlr-20">
          <span class="pdlr-5">Redis</span>
          <span class="pdlr-5 ft-20">·</span>
          <span class="pdlr-5">Zookeeper</span>
          <br />
          <span class="pdlr-5">Elasticsearch</span>
          <span class="pdlr-5 ft-20">·</span>
          <span class="pdlr-5">Kafka</span>
          <br />
          <span class="pdlr-5">Mysql</span>
          <span class="pdlr-5 ft-20">·</span>
          <span class="pdlr-5">Oracle</span>
          <span class="pdlr-5 ft-20">·</span>
          <span class="pdlr-5">达梦</span>
          <br />
          <span class="pdlr-5">神通</span>
          <span class="pdlr-5 ft-20">·</span>
          <span class="pdlr-5">金仓</span>
          <span class="pdlr-5 ft-20">·</span>
          <span class="pdlr-5">Sqlite</span>
        </p>
      </div>
      <div class="login-right" v-if="loginForm != null">
        <Form
          :formBuild="loginForm"
          :formData="loginData"
          :saveShow="false"
          class="pd-10"
        >
          <div class="col-12">
            <el-checkbox v-model="rememberPassword">记住密码 </el-checkbox>
            <el-checkbox v-model="autoLogin">自动登录 </el-checkbox>
          </div>
          <div class="pdtb-10 col-12">
            <div
              v-if="source.hasPower('login')"
              class="tm-btn bg-teal-8 ft-18 pdtb-5 tm-btn-block"
              :class="{ 'tm-disabled': loginBtnDisabled }"
              @click="doLogin"
            >
              登&nbsp;&nbsp;录
            </div>
          </div>
          <div
            v-if="
              source.hasPower('login') && source.setting.loginAnonymousEnable
            "
            class="pdtb-10 text-right ft-18"
          >
            允许匿名登录，
            <div
              class="tm-link color-orange-7 mgt--1"
              @click="doAnonymousLogin()"
            >
              匿名登录
            </div>
          </div>
          <div
            v-if="source.hasPower('register') && source.setting.registerEnable"
            class="pdtb-10 text-right ft-13"
          >
            没有账号？
            <div class="tm-link color-orange mgt--1" @click="tool.toRegister()">
              立即注册
            </div>
          </div>
          <!-- <b-form-group>
            <b-form-checkbox
              v-model="rememberPassword"
              :value="true"
              class="float-left mgr-20"
            >
              记住密码
            </b-form-checkbox>
            <b-form-checkbox
              v-model="autoLogin"
              :value="true"
              class="float-left mgr-20"
            >
              自动登录
            </b-form-checkbox>
          </b-form-group>
          <div class="pdtb-10">
            <div
              v-if="source.hasPower('login')"
              class="tm-btn bg-teal-8 ft-18 pdtb-5 tm-btn-block"
              :class="{ 'tm-disabled': loginBtnDisabled }"
              @click="doLogin"
            >
              登&nbsp;&nbsp;录
            </div>
          </div>
          <div
            v-if="source.hasPower('register')"
            class="pdtb-10 text-right ft-13"
          >
            没有账号？
            <div class="tm-link color-orange mgt--1" @click="tool.toRegister()">
              立即注册
            </div>
          </div> -->
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["source"],
  data() {
    return {
      loginForm: null,
      loginData: null,
      rememberPassword: false,
      autoLogin: false,
      loginBtnDisabled: false,
    };
  },
  // 计算属性 只有依赖数据发生改变，才会重新进行计算
  computed: {},
  // 计算属性 数据变，直接会触发相应的操作
  watch: {
    rememberPassword() {
      if (!this.rememberPassword) {
        this.autoLogin = false;
      }
    },
    autoLogin() {
      if (this.autoLogin) {
        this.rememberPassword = true;
      }
    },
  },
  methods: {
    doAnonymousLogin() {
      let anonymousUserId = this.tool.getCache("anonymousUserId");
      if (anonymousUserId != null && anonymousUserId != "") {
        anonymousUserId = Number(anonymousUserId);
      } else {
        anonymousUserId = null;
      }
      this.server
        .login({
          anonymous: true,
          anonymousUserId: anonymousUserId,
        })
        .then((res) => {
          if (res.code == 0) {
            this.tool.setJWT(res.data);
            this.tool.success("匿名登录成功！");
            this.tool.initSession();
            setTimeout(() => {
              this.tool.hideLogin();
            }, 300);
          } else {
            this.tool.error(res.msg);
          }
        });
    },
    doLogin() {
      this.loginBtnDisabled = true;
      this.loginForm.validate(this.loginData).then((res) => {
        if (res.valid) {
          let param = {};
          Object.assign(param, this.loginData);
          let aesPassword = this.tool.aesEncrypt(param.password);
          param.password = aesPassword;
          this.server
            .login(param)
            .then((res) => {
              this.loginBtnDisabled = false;
              if (res.code == 0) {
                this.tool.setJWT(res.data);
                this.tool.success("登录成功！");
                this.tool.initSession();
                if (this.autoLogin) {
                  this.tool.setCache("autoLogin", "1");
                } else {
                  this.tool.removeCache("autoLogin");
                }
                if (this.rememberPassword) {
                  this.tool.setCache("rememberPassword", "1");
                  this.tool.setCache(
                    "loginData",
                    this.tool.aesEncrypt(
                      this.tool.JSONbig.stringify(this.loginData)
                    )
                  );
                } else {
                  this.tool.removeCache("rememberPassword");
                  this.tool.removeCache("loginData");
                }
                setTimeout(() => {
                  this.tool.hideLogin();
                }, 300);
              } else {
                this.tool.error(res.msg);
                this.tool.removeCache("autoLogin");
                this.tool.removeCache("loginData");
              }
            })
            .catch((e) => {
              this.loginBtnDisabled = false;
            });
        } else {
          this.loginBtnDisabled = false;
        }
      });
    },
    init() {
      this.loginForm = this.form.build(this.form.login);
      let loginData = this.loginForm.newDefaultData();
      let setLoginDataSuccess = false;
      if (this.tool.getCache("rememberPassword") == "1") {
        this.rememberPassword = true;
        let loginDataValue = this.tool.getCache("loginData");
        if (this.tool.isNotEmpty(loginDataValue)) {
          try {
            let json = this.tool.JSONbig.parse(
              this.tool.aesDecrypt(loginDataValue)
            );
            for (let key in loginData) {
              if (json[key]) {
                loginData[key] = json[key];
                setLoginDataSuccess = true;
              }
            }
          } catch (e) {}
        }
      }
      if (this.tool.getCache("autoLogin") == "1") {
        this.autoLogin = true;
      }
      this.loginData = loginData;
      if (this.autoLogin && setLoginDataSuccess) {
        if (setLoginDataSuccess) {
          this.doLogin();
        }
      }
    },
  },
  // 在实例创建完成后被立即调用
  created() {},
  // el 被新创建的 vm.$el 替换，并挂载到实例上去之后调用
  mounted() {
    this.init();
  },
};
</script>

<style>
.login-page {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 100;
  background: #fff;
}
.login-box {
  position: absolute;
  width: 860px;
  height: 400px;
  left: 50%;
  top: 50%;
  margin-left: -420px;
  margin-top: -260px;
}
.login-left {
  width: 400px;
  height: 100%;
  float: left;
  font-weight: 700;
}
.login-right {
  width: 400px;
  height: 100%;
  float: right;
}
.login-page .el-form-item__label {
  color: #ffffff;
}
.login-page .el-checkbox__label {
  color: #ffffff;
}
.login-page .el-checkbox__input.is-checked + .el-checkbox__label {
  color: #ffffff;
}
</style>

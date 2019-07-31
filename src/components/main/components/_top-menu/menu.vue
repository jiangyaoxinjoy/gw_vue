<template>
  <div>
     11111111lldldldldlslfdlfdladlsfdslslf
    <Menu
      mode="horizontal"
      :theme="theme"
      :active-name="activeName"
      :accordion= "true"
    >
      <div class="wrapper-header-nav">
        <router-link to="/bar" class="wrapper-header-nav-logo"><img src="@/assets/images/logo.png"></router-link>
        <div class="wrapper-header-nav-list">
          <MenuItem name="alarm_monitoring" to="/alarm_monitoring">
            <!-- <Icon type="ios-paper" /> -->
            报警监控
          </MenuItem>
          <MenuItem name="statusData" to="/status/data">
            <!-- <Icon type="ios-paper" /> -->
            设备状态
          </MenuItem>
          <MenuItem name="trace" to='/trace'>
            <!-- <Icon type="ios-paper" /> -->
            监控追溯
          </MenuItem>
          <Submenu name="manage">
            <template slot="title">
                <Icon type="md-settings" />
                管理
            </template>
            <MenuGroup class="manage_group">
              <MenuItem v-for="item in comNav" :key="item.name" :name="item.name" :to="item.path">{{item.label}}</MenuItem>
            </MenuGroup>
          </Submenu>
          <div class="info-menu">
            <MenuItem name="show" to='/show' target="_blank">
              <Icon type="md-analytics" size="32" color="#02a2aa"/>
            </MenuItem>
            <user :user-name="userName"/>
          </div>
        </div>
      </div>
    </Menu>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import User from '../user'
export default {
  name: 'TopMenu',
  props: {
    activeName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      theme: 'dark',
      isFullscreen: false
    }
  },
  components: {
    User
  },
  computed: {
    userName () {
      return this.$store.state.user.userName
    },
    ...mapGetters({
      comNav: 'comNavset'
    })
  },
  watch: {
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
@import './menu.less';
</style>
<style type="text/css">
.manage_group .ivu-menu-item-group-title{
  height: 0;
}
</style>

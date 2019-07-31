<template>
  <div class="user-avatar-dropdown">
    <Dropdown @on-click="handleClick">
      <Badge :dot="!!messageUnreadCount">
        <Button type="primary" shape="circle" size="small">{{userName}}</Button>
      </Badge>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="changePsd">修改密码</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
    <ResetPsdModal :modal="modal"  @changeModalState="changeModal" />
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
import { ResetPsdModal } from '_c/modal/index'
export default {
  name: 'User',
  components: {
    ResetPsdModal
  },
  data () {
    return {
      modal: false
    }
  },
  props: {
    userName: {
      type: String,
      default: ''
    },
    messageUnreadCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
        case 'changePsd': this.showModal()
          break
      }
    },
    showModal () {
      this.modal = true
    },
    changeModal (val) {
      this.modal = val
    }
  }
}
</script>

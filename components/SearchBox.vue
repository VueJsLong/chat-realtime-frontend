<template>
  <div class="search">
    <input
      type="text"
      class="search-input"
      v-model="searchInput"
      placeholder="Tìm kiếm"
      @keyup.enter="search"
    />
    <button class="search-btn m-icon-btn" @click="search">
      <i class="fi fi-rr-search input-search-icon"></i>
    </button>

    <div class="search-result-container">
      <div class="search-data" v-if="searchResult">
        <div class="search-user__thumbnail">
          <img
            :src="thumbnail(searchResult?.thumbnail)"
            alt=""
            referrerpolicy="no-referrer"
          />
        </div>
        <div class="search-user__fullName --text-ellipsis-2">
          {{ searchResult.fullName }}
        </div>
        <div class="search-user__addFriendBtn">
          <button
            type="button"
            class="m-icon-btn --primary"
            @click.stop="setConversation"
            title="send message"
          >
            <i class="fi fi-rr-comment"></i>
          </button>
          <button
            type="button"
            class="m-icon-btn --primary"
            @click.stop="sendRequestFriend"
            title="request friend"
          >
            <i class="btn-icon fi fi-rr-user-add"></i>
          </button>
        </div>
      </div>
      <div class="search-data" v-else>
        <div class="search-message">Không tìm thấy người dùng.</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  data() {
    return {
      searchInput: '',
      searchResult: null,
    }
  },
  mounted() {},
  computed: {},
  methods: {
    search() {
      this.searchResult = null
      this.searchInput = String(this.searchInput).trim()
      if (!this.searchInput) return
      const p = this.$axios
        .get(this.$api.findUser, {
          params: {
            email: this.searchInput,
          },
        })
        .then((res) => {
          this.searchResult = res.data.data
        })
      this.axiosLoadError(p)
    },
    sendRequestFriend() {
      this.debug('Search result', this.searchResult)
      const me = this
      const socket = me.$store.getters.getSocket

      // emit event
      const payload = {
        from: me.$auth.user.id,
        to: this.searchResult.id,
      }
      socket.emit(me.$socketEvent.friend.requestFriend, payload, (res) => {
        me.debug(res)
        me.appendRequests(res)
        this.$snotify.success(me.$socketEvent.friend.requestFriend)
      })
    },
    setConversation() {
      const { id, fullName, thumbnail } = this.searchResult
      this.$store.dispatch('setConversation', {
        targetId: id,
        targetName: fullName,
        targetThumbnail: thumbnail,
        target: 'USER',
      })
    },
  },
}
</script>

<style></style>

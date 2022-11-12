<template>
  <div class="chat" v-if="conversation">
    <div class="chat-box">
      <!-- header start -->
      <div class="chat-box__header">
        <div class="item">
          <img
            :src="conversation.targetThumbnail"
            alt=""
            class="m-thumbnail"
            referrerpolicy="no-referrer"
          />
          <div class="content">
            <div class="friends-message"></div>
            <div>{{ conversation.targetName }}</div>
          </div>
        </div>
        <div class="chat-box-header__icons">
          <button
            class="m-icon-btn"
            :class="{ active: isSearchShow }"
            @click="toggleSearchTool"
            title="search"
          >
            <i class="fi fi-rr-search"></i>
          </button>
          <button
            class="m-icon-btn"
            :class="{ active: isInfoShow }"
            @click="toggleChatInfo"
            title="chat info"
          >
            <i class="fi fi-rr-info"></i>
          </button>
        </div>
      </div>
      <!-- header end -->

      <!-- tool start-->
      <div class="chat-box__tool" v-if="isSearchShow">
        <div class="search-tool">
          <div class="m-textfield --no-border">
            <div class="m-input-container">
              <input
                class="m-input-container__input"
                type="text"
                name="input"
                placeholder="Placeholder"
              />
              <button
                type="button"
                class="m-input-container__icon m-icon m-icon-btn"
                tabindex="-1"
              >
                <i class="fi fi-rr-search input-search-icon"></i>
              </button>
            </div>
          </div>
          <div class="search-tool__paging">
            <button class="m-icon-btn">
              <i class="fi fi-rs-angle-up"></i>
            </button>
            <span>1/7</span>
            <button class="m-icon-btn">
              <i class="fi fi-rs-angle-down"></i>
            </button>
          </div>
        </div>
      </div>
      <!-- tool end -->

      <!-- content start -->
      <div ref="chatBoxContent" class="chat-box__content scroll-y">
        <ChatMessage
          v-for="(item, index) in chatMessages"
          :key="item.id"
          :data="item"
          :isSameSource="isMessagesSameSource(index)"
        ></ChatMessage>
      </div>
      <!-- content end -->

      <!-- footer start -->
      <div class="chat-box__footer">
        <textarea
          type="text"
          class="chat-box__input scroll-y"
          placeholder="Aa"
          v-model="messageInput"
          @keyup.ctrl.enter="handleCtrlEnter"
        ></textarea>
        <div class="chat-box-footer__icon">
          <button class="m-icon-btn" title="send message" @click="sendMessage">
            <i class="fi fi-rs-paper-plane"></i>
          </button>
          <button class="m-icon-btn" title="send image">
            <i class="fi fi-rr-picture"></i>
          </button>
          <button class="m-icon-btn" title="send voice">
            <i class="fi fi-rr-microphone"></i>
          </button>
          <button class="m-icon-btn" title="send emoji">
            <i class="fi fi-rr-smile"></i>
          </button>
        </div>
      </div>
    </div>
    <chat-info v-if="isInfoShow" @hideChatInfo="toggleChatInfo"></chat-info>
  </div>
  <div class="chat-introduction" v-else>
    <chat-introduction></chat-introduction>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chatMessages: [],
      conversation: null,
      messageInput: '',
      isInfoShow: false,
      isSearchShow: false,
      searchInput: '',
    }
  },
  watch: {
    '$store.state.conversation'() {
      this.conversation = this.$store.getters.getConversation
      this.getCurrentConversation()
    },
    '$store.state.chatMessages'() {
      this.chatMessages = this.$store.getters.getChatMessages
    },
  },
  mounted() {},
  updated() {
    this.chatBoxScrollBottom()
  },
  methods: {
    getCurrentConversation(page = 1, size = 20) {
      this.log('change conversation', this.conversation)
      const params = {
        target: this.conversation.target,
        page: page,
        size: size,
      }
      this.$axios
        .get(`${this.$api.conversation}/${this.conversation.targetId}`, {
          params,
        })
        .then((res) => {
          this.$store.dispatch('setChatMessages', res.data.data)
        })
        .catch((err) => {
          this.log(err)
        })
    },
    async handleCtrlEnter() {
      await this.sendMessage()
    },
    async sendMessage() {
      if (String(this.messageInput).trim() == '') return

      const me = this
      const socket = this.$store.getters.getSocket
      // this.log(socket)

      const payload = {
        from: me.$auth.user.id,
        to: this.conversation.targetId,
        content: this.messageInput,
        status: null,
        target: this.conversation.target,
      }
      socket.emit(me.$socketEvent.chat.sendMessages, payload, (res) => {
        // me.$snotify.success(me.$socketEvent.chat.sendMessages)
        me.debug(res)
        me.appendChatMessages(res)
        me.messageInput = ''
      })
    },
    isMessagesSameSource(index) {
      if (index == 0) return false
      return (
        this.chatMessages[index].from.id == this.chatMessages[index - 1].from.id
      )
    },
    chatBoxScrollBottom() {
      const chatBoxContent = this.$refs.chatBoxContent
      chatBoxContent.scrollTop = chatBoxContent.scrollHeight
      // this.log(chatBoxContent)
    },
    toggleChatInfo() {
      this.isInfoShow = !this.isInfoShow
    },
    toggleSearchTool() {
      this.isSearchShow = !this.isSearchShow
    },
    searchMessage() {
      console.log(this.searchInput)
    },
  },
}
</script>

<style></style>
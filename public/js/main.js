new Vue({
  el: '#app',
  data: {
    socket: null,
    reveal: null,
    key: '',
    secret: '',
    granted: false,
    error: false
  },
  created: function () {
    this.socket = io()
    this.reveal = Reveal

    this.socket.on('secret', key => {
      this.secret = key
    })
    this.socket.on('init-state', state => {
      this.reveal.setState(state)
    })
  },
  mounted: function () {
    this.$refs.key.focus()
  },
  methods: {
    initRevealJS: function () {
      this.reveal.initialize()

      this.socket.on('slide-changed', state => {
        this.reveal.setState(state)
      })

      this.reveal.addEventListener('slidechanged', event => {
        this.socket.emit('slide-changed', this.reveal.getState())
      })
    },
    onAppClick: function () {
      !this.granted && this.$refs.key.focus()
    },
    handleSubmit: function () {
      if (this.key === this.secret) {
        this.granted = true
        this.initRevealJS()
      } else {
        this.error = true
      }
    }
  }
})
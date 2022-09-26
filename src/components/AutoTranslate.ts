import Vue from 'vue';

export default Vue.extend({
  name: 'AutoTranslate',
  props: {
    tag: {
      type: String,
      default: 'span',
    },
    text: {
      type: String,
      required: true,
    },
  },
  methods: {
    registerText() {
      if (!this.$te(this.text)) {
        this.$axios.$post('/api/nuxt-auto-translate/messages', {
          text: this.text,
        });
      }
    },
  },
  mounted() {
    this.registerText();
  },
  template: `<component :is="tag">{{$t(text)}}</component>`,
});

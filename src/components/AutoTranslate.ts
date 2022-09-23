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
  mounted() {
    this.$axios.$post('/api/nuxt-auto-translate/messages', { text: this.text });
  },
  template: `<component :is="tag">{{$t(text)}}</component>`,
});

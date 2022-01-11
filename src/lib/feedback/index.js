import Vue from 'vue';
import feedback from './feedback.vue';

export function mountFeedback() {
  const feedbackWrap = document.createElement('div');
  feedbackWrap.setAttribute('id', 'feedback-wrap');
  document.body.appendChild(feedbackWrap);
  new Vue({
    render: (h) => h(feedback),
  }).$mount('#feedback-wrap');
}

export const JtFeedback = feedback;

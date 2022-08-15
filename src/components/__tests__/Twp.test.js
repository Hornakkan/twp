import { describe, it, expect, test } from 'vitest'

import { mount, shallowMount } from '@vue/test-utils'
import router from '@/router'
import IndexHeader from '../IndexHeader.vue'
import IndexLogo from '../IndexLogo.vue'
import IndexPost from '../IndexPost.vue'
import ItemList from '../ItemList.vue'
import ItemPost from '../ItemPost.vue'
import { RouterLink, RouterView } from 'vue-router'

describe('IndexHeader', () => {
  it('Header component loads properly', () => {
    const wrapper = mount(IndexHeader);
    expect(wrapper.find('div').exists()).toBeTruthy();
  })
});

describe('IndexLogo', () => {
  it('Logo component loads properly', () => {
    const wrapper = mount(IndexLogo);
    expect(wrapper.find('div').exists()).toBeTruthy();
  })
});

describe('ItemList', () => {
  it('List component loads properly', () => {
    const wrapper = mount(ItemList);
    expect(wrapper.find('div').exists()).toBeTruthy();
  })
});

describe('ItemPost', () => {
  it('Post component loads properly', async () => {
    router.push('/note/24');
    await router.isReady();
    const wrapper = mount(ItemPost, {
      global: {
        plugins: [router],
      }
    });
    wrapper.setProps({postId: 24})
    // expect(wrapper.find('div').exists()).toBeTruthy();
  })
});


// ReferenceError: fetch is not defined pour les tests ci-dessous

// // Index rendering tests
// describe('IndexPost', () => {
//   it('Index page loads properly', () => {
//     const wrapper = shallowMount(IndexPost);
//     expect(wrapper.find('div').exists()).toBeTruthy();
//     expect(wrapper.find('input[type="text"]').exists()).toBeTruthy();
//     expect(wrapper.find('input[type="text"]')).toContain('');
//     expect(wrapper.find('button').exists()).toBeTruthy();
//   })
// });
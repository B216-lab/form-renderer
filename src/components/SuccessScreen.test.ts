import { describe, it, expect, vi } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import { createI18n } from 'vue-i18n';
import SuccessScreen from './SuccessScreen.vue';
import { messages } from '@/i18n';

describe('SuccessScreen', () => {
  const createWrapper = () => {
    const router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        {
          path: '/form',
          name: 'day-movements',
          component: { template: '<div>Form</div>' },
        },
      ],
    });

    const i18n = createI18n({
      legacy: false,
      locale: 'ru',
      fallbackLocale: 'ru',
      messages,
    });

    return mount(SuccessScreen, {
      global: {
        plugins: [router, i18n],
        stubs: {
          UCard: { template: '<div class="u-card"><slot /></div>' },
          UButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
            emits: ['click'],
          },
          UIcon: { template: '<span class="u-icon"></span>' },
        },
      },
    });
  };

  const getByTestId = (wrapper: VueWrapper, testId: string) => {
    const element = wrapper.find(`[data-testid="${testId}"]`);
    if (!element.exists()) {
      throw new Error(`Element with data-testid="${testId}" not found`);
    }
    return element;
  };

  it('should render success screen container', () => {
    const wrapper = createWrapper();
    expect(getByTestId(wrapper, 'success-screen').exists()).toBe(true);
  });

  it('should render success icon container', () => {
    const wrapper = createWrapper();
    expect(getByTestId(wrapper, 'success-icon-container').exists()).toBe(true);
  });

  it('should render success title', () => {
    const wrapper = createWrapper();
    const title = getByTestId(wrapper, 'success-title');
    expect(title.text()).toBeTruthy();
  });

  it('should render success message', () => {
    const wrapper = createWrapper();
    const message = getByTestId(wrapper, 'success-message');
    expect(message.text()).toBeTruthy();
  });

  it('should render fill another form button', () => {
    const wrapper = createWrapper();
    const button = getByTestId(wrapper, 'fill-another-form-button');
    expect(button.text()).toBeTruthy();
  });

  it('should navigate to form when button is clicked', async () => {
    const wrapper = createWrapper();
    const router = wrapper.vm.$router;
    const pushSpy = vi.spyOn(router, 'push');

    const button = getByTestId(wrapper, 'fill-another-form-button');
    await button.trigger('click');

    expect(pushSpy).toHaveBeenCalledWith({
      name: 'day-movements',
      query: expect.objectContaining({
        reset: expect.any(String),
      }),
    });
  });
});

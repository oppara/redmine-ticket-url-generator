import { shallowMount } from '@vue/test-utils';
import FormElement from '@/components/FormElement.vue';
import { Input } from 'element-ui';

describe('UseElement.vue', () => {
  it('コンポーネントが表示されるか', () => {
    const wrapper = shallowMount(FormElement, {});
    expect(wrapper.findAll(Input).length).toBe(4);
  });
});

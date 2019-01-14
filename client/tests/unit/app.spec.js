import { mount } from '@vue/test-utils'
import App from '@/App.vue'
import axios from '../../src/utils/axios';

jest.mock('../../src/utils/axios')

describe('App.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(App);
  });

  afterEach(() => wrapper.destroy())

  it('renders App component', () => {
    expect(wrapper).toBeDefined()
    expect(wrapper.find('.wrapper')).toBeDefined()
  })

  it('should be able to generate a new number', (done) => {
    axios.post.mockResolvedValue({ data: { data: "0123456789" } })
    wrapper.find('.action-box').trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.showAlert).toBeTruthy()
      expect(wrapper.vm.isSuccessAlert).toBeTruthy()
      expect(wrapper.vm.msgAlert).toContain('Phone number successfully generated.')
      expect(wrapper.vm.phoneNumbers).toContain("0123456789")
      expect(wrapper.find('.phone-numbers span').text()).toEqual("0123456789")
      expect(wrapper.find('.action-boxes span').text()).toEqual("Total: 2")
      expect(wrapper.find('.alert-success').text()).toContain("Phone number successfully generated.")
      done()
    });
  })

  it('should not be able to generate a new number', (done) => {
    axios.post.mockRejectedValue({ response: { data: { msg: "failure" } } })
    wrapper.find('.action-box').trigger('click');
    wrapper.vm.$nextTick(() => {
      done()
    });
  })

  it('should get all phone numbers', (done) => {
    const MAX_NUMBER = '0435216789';
    const MIN_NUMBER = '0123456789';
    const data = [MIN_NUMBER, MAX_NUMBER];

    axios.get.mockResolvedValue({ data: { data } })
    wrapper.findAll('.action-box').at(1).trigger('click');
    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.phoneNumbers[1]).toContain(MAX_NUMBER)
      expect(wrapper.vm.maxNumber).toEqual(MAX_NUMBER)
      expect(wrapper.vm.minNumber).toEqual(MIN_NUMBER)
      expect(wrapper.vm.sortOrder).toEqual('asc');
      expect(wrapper.findAll('.max-min-container span').at(0).text()).toEqual("Max: 0435216789")
      expect(wrapper.findAll('.max-min-container span').at(1).text()).toEqual("Min: 0123456789")
      done()
    });
  });

  it('should not get all phone numbers', (done) => {
    axios.get.mockRejectedValue({ response: { data: { msg: "failure" } } });
    wrapper.findAll('.action-box').at(1).trigger('click');
    wrapper.vm.$nextTick(() => {
      done()
    });
  });

  it('should call sort phone numbers function', (done) => {
    const MAX_NUMBER = '0435216789';
    const MIN_NUMBER = '0123456789';
    const data = [MIN_NUMBER, MAX_NUMBER];

    wrapper.setData({ sortOrder: 'asc', minNumber: '', maxNumber: '', phoneNumbers: data });
    wrapper.vm.sortPhoneNumbers();

    wrapper.vm.$nextTick(() => {
      expect(wrapper.vm.phoneNumbers[0]).toContain(MAX_NUMBER)
      expect(wrapper.vm.maxNumber).toEqual(MAX_NUMBER)
      expect(wrapper.vm.minNumber).toEqual(MIN_NUMBER)
      expect(wrapper.vm.sortOrder).toEqual('desc');
      done()
    });
  });
});

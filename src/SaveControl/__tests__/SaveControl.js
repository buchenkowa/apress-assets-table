import React from 'react';
import {shallow, mount, render} from 'enzyme';
import SaveControl from '../SaveControl';


describe('SaveControl', () => {
  const message = {
    success: 'Все изменения сохранены',
    progress: 'Изменения сохраняются',
    error: 'Ошибка сохранения',
  };

  it('should render a SaveControl state success', () => {
    const wrapper = shallow(
      <SaveControl
        isSuccess={true}
        message={message}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a SaveControl state error', () => {
    const wrapper = shallow(
      <SaveControl
        isError={true}
        message={message}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('should render a SaveControl state progress', () => {
    const wrapper = shallow(
      <SaveControl
        isProgress={true}
        message={message}
      />
    );
    expect(wrapper).toMatchSnapshot();
  });
});

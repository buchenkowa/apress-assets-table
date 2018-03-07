import PreviewImagesBoxView from '../views/PreviewImagesBoxView';
import PreviewImageView from '../views/PreviewImageView';
import previewImageActionTypes from '../../../constants/imageEditor';
import {getShallowWrapper} from '../../../../test/testUtils';


jest.mock('../views/PreviewImageView', () => () => <div />);

describe('PreviewImagesBoxView', () => {
  const props = {
    previews: ['', ''],
    onClick: jest.fn(),
    actionType: previewImageActionTypes.add
  };
  const className = '.preview-images-box';
  let preview;

  beforeAll(() => {
    const wrapper = getShallowWrapper(PreviewImagesBoxView, props);
    const rootElement = wrapper.find(className);

    preview = rootElement.find(PreviewImageView);
  });

  it('should display previews', () => {
    expect(preview).toHaveLength(props.previews.length);
  });
});

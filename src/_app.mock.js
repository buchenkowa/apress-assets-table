/* eslint-disable */

const companyID = 32;

const app = {
  config: {
    productsEditorUrl: 'predl/groups',
    rubricatorUrl: '/tree',
    rubricatorUpdate: '/tree/update',
    dataUrl: '/table/data',
    urlSaveTiger: '/table/save',
    urlJob: '/table/save',
    productGroupSpecificationsUrl: 'get-group-children',
    deleteEmptyProductGroupsUrl: `/api/v1/companies/${companyID}/empty_product_groups`,
    companySettingsShowProductGroupsUrl:
      '/api/v1/companies/:company_id/company_settings/show_product_groups',

    help: {
      url: '/help',
      data: {}
    },

    scenarios: {
      current: {
        slug: ''
      }
    },

    switchGroupsView: {
      'groups_short_title': 'Ваши группы',
      'rubrics_short_title': 'Рубрики ПЦ',
      'groups_title': 'Ваши группы',
      'rubrics_title': 'Рубрики Пульса цен',
      'rubrics_description': 'Вид каталога, состоящий из рубрик площадки Пульс цен, к которым привязаны ваши товары.',
      'groups_description': 'Вид каталога, в котором вы сами можете сгруппировать свои товары и услуги так, чтобы он более точно соответствовал ассортименту вашей компании.',
      'rubrics_tooltip': 'Режим Рубрики Пульса цен - это вид каталога состоящий из рубрик площадки Пульс цен к которым привязаны ваши товары. Если вы хотите использовать свои группы, переключитесь в режим Ваши группы.'
    },
    ckeditor: {
      toolbarTiger: []
    },
    onlineStoreImportStatus: {
      messageDuringImport: '',
      timeOut: 1,
      statusbar: ''
    },
    traitFiltersDisplaying: {
      options: [
        {value: null, text: 'По умолчанию'},
        {value: false, text: 'Выключен'},
        {value: true, text: 'Включен'},
      ]
    },
    imageEditor: {
      imageUploadUrl: '/upload-images',
      imageModelName: 'imageModelName',
      recommendedImagesUrl: `/api/v1/companies/${companyID}/product_groups/_PRODUCT_GROUP_ID_/recommended_images?count=3`,
      imageSelectTextZone: '<p>Предложенные фото выбраны автоматически на основе фотографий, загруженных в товары. Если они вам не подходят, загрузите другое фото.</p>'
    },
    tigerLocales: {
      imageEditor: {
        title: 'Загрузить фотографию',
        recommendImagesTitle: 'Выберите из предложенных:',
        setPhotoForGroup : 'Установите фотографию для группы',
        urlFieldPlaceholder: 'Вставьте URL на изображение',
        uploadNewImage: 'или Загрузите новую',
        uploadPhoto: 'Загрузить фотографию',
        duringLoadingRecommendedImagesTitle: 'Сейчас предложим картинки из товаров в группе'
      }
    }
  }
};

window.app = app;

export default app;

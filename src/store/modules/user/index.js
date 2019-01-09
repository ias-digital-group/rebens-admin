import _ from 'lodash';
const state = {
  pageSettings: {
    pages: []
  }
};
const mutations = {
  setPageSetting(state, settings) {
    _.remove(state.pageSettings.pages, function(o) {
      return o.name == settings.name;
    });
    state.pageSettings.pages.push(settings);
  }
};

const getters = {
  getPageSettings: state => pageName => {
    if (state.pageSettings && state.pageSettings.pages) {
      const c = _.find(state.pageSettings.pages, function(o) {
        return o.name == pageName;
      });
      return c ? c : null;
    }
    return null;
  }
};

export default {
  state,
  mutations,
  getters
};

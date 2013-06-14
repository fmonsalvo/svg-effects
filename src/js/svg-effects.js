var effects = (function() {

  var filtersContainer = (function() {
    var container = document.createElement('svg');
    container.classList.add('filters-container');
    document.body.appendChild(container);
    return container;
  })(),

  filterCache = {},

  addInsetShadow = function(el, dx, dy, color, blur) {
    if (typeof el !== 'string') {
      return;
    }

    el = document.querySelector(el);

    if (!el) {
      return;
    }

    var tplSource = '<filter class="inset-shadow" x0="-50%" y0="-50%" width="200%" height="200%">' +
                      '<feGaussianBlur in="SourceAlpha" stdDeviation="{{blur}}" result="blur"/>' +
                      '<feOffset dy="{{dx}}" dx="{{dy}}"/>' +
                      '<feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"/>' +
                      '<feFlood flood-color="black" flood-opacity="1"/>' +
                      '<feComposite in2="shadowDiff" operator="in"/>' +
                      '<feComposite in2="SourceGraphic" operator="over"/>' +
                    '</filter>',
        template = Handlebars.compile(tplSource),
        config = {
          'dx' : dx,
          'dy' : dy,
          'color' : color,
          'blur' : blur
        },
        cachedFilter = findInCache('insetShadow', config);

    if (!cachedFilter) {
      var filter = template(config);
      filtersContainer.append(filter);
    }

    var effectID = cachedFilter ? cachedFilter.filterId : generateFilterId('insetShadow');
    if (cachedFilter) {
      addToCache('insetShadow', config, effectID);
    }

    el.style = 'filter: url(' + effectID + ')';
  },

  addDropShadow = function(el, dx, dy, color, blur) {
  },

  addBlur = function() {

  },

  addToCache = function(filterType, config, id) {
    filterCache[filterType].push({config: config, id: id});
  },

  findInCache = function(filterType, config) {
    var filters = filterCache[filterType];
    for (var i = filters.length - 1; i >= 0; i--) {
      if (compare(filters[i].config, config)) {
        return filters[i];
      }
    }
  },

  compare = function(config1, config2) {
    if (config1.dx === config2.dx && config1.dy === config2.dy &&
        config1.color === config2.color && config1.blur === config2.blur) {
      return true;
    } else {
      return false;
    }
  },

  generateFilterId = function(filterType) {
    var filters = filterCache[filterType];
    return filterType + (filters.length + 1);
  };

})();

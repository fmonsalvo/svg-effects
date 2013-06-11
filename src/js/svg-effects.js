var effects = (function() {

  var filtersContainer = (function() {
    container = document.createElement('svg');
    container.classList.add('filters');
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

    var tplSource = 'innerShadow',
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
    el.style = 'filter: url(' + effectID + ')';
  },

  addDropShadow = function(el, dx, dy, color, blur) {
  },

  addBlur = function() {

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

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
        effectID;

    effectID = this.createFilter('insetShadow', config, template);

    el.style += 'filter: url(' + effectID + ')';
  },

  addDropShadow = function(el, dx, dy, color, blur) {
  },

  addBlur = function(el, radius) {
    if (typeof el !== 'string') {
      return;
    }

    el = document.querySelector(el);

    if (!el) {
      return;
    }

    var tplSource = '<filter id="blur">' +
                    '<feGaussianBlur stdDeviation="{{radius}}" edgeMode="none" >' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'radius' : radius
      },
      effectID;
    
    effectID = this.createFilter('blur', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  createFilter = function(filterName, config, template) {
    var filter,
        effectID,
        cachedFilter = findInCache(filterName, config);

    if (!cachedFilter) {
      filter = template(config);
      filtersContainer.append(filter);
    }

    effectID = cachedFilter ? cachedFilter.filterId : generateFilterId(filterName);
    if (cachedFilter) {
      addToCache(filterName, config, effectID);
    }

    return effectID;
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

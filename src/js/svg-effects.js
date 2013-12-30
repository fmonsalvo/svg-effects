var effects = (function() {

  var filtersContainer = (function() {
    var container = document.createElement('svg');
    container.classList.add('filters-container');
    document.body.appendChild(container);
    return container;
  })(),

  filterCache = {},

  addInsetShadow = function(el, dx, dy, color, blur) {
    el = findElement(el);

    var tplSource = '<filter id="{{id}}" class="inset-shadow" x0="-50%" y0="-50%" width="200%" height="200%">' +
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

  addDropShadow = function(el, dx, dy, color, radius) {
    el = findElement(el);

    var tplSource = '<filter class="drop-shadow" id="{{id}}">' +
                      '<feGaussianBlur in="SourceAlpha" stdDeviation="{{radius}}"/>' +
                      '<feOffset dx="{{dx}}" dy="{{dy}}" result="offsetblur"/>' +
                      '<feFlood flood-color="{{color}}"/>' +
                      '<feComposite in2="offsetblur" operator="in"/>' +
                      '<feMerge>' +
                        '<feMergeNode/>' +
                        '<feMergeNode in="SourceGraphic"/>' +
                      '</feMerge>' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'dx'     : dx,
        'dy'     : dy,
        'color'  : color,
        'radius' : radius
      },
      effectID;
    
    effectID = this.createFilter('blur', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  addBlur = function(el, radius) {
    el = findElement(el);
    var tplSource = '<filter class="blur" id="{{id}}">' +
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

  addContrast = function() {
    el = findElement(el);

    var tplSource = '<filter class="contrast" id="{{id}}">' +
                      '<feComponentTransfer>' +
                          '<feFuncR type="linear" slope="{{amount}}" intercept="-(0.5 * {{amount}}) + 0.5"/>' +
                          '<feFuncG type="linear" slope="{{amount}}" intercept="-(0.5 * {{amount}}) + 0.5"/>' +
                          '<feFuncB type="linear" slope="{{amount}}" intercept="-(0.5 * {{amount}}) + 0.5"/>' +
                      '</feComponentTransfer>' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'amount' : amount
      },
      effectID;
    
    effectID = this.createFilter('contrast', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  addGrayScale = function(amount) {
    el = findElement(el);

    var tplSource = '<filter class="grayscale" id="{{id}}">' +
                      '<feColorMatrix type="matrix"' +
                          'values="(0.2126 + 0.7874 * [1 - amount]) (0.7152 - 0.7152 * [1 - amount]) (0.0722 - 0.0722 * [1 - amount]) 0 0' +
                            '(0.2126 - 0.2126 * [1 - amount]) (0.7152 + 0.2848 * [1 - amount]) (0.0722 - 0.0722 * [1 - amount]) 0 0' +
                            '(0.2126 - 0.2126 * [1 - amount]) (0.7152 - 0.7152 * [1 - amount]) (0.0722 + 0.9278 * [1 - amount]) 0 0' +
                          '0 0 0 1 0"/>' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'amount' : amount
      },
      effectID;
    
    effectID = this.createFilter('grayscale', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  addSepia = function(amount) {
    el = findElement(el);

    var tplSource = '<filter class="sepia" id="{{id}}">' +
                      '<feColorMatrix type="matrix"' +
                        'values="(0.393 + 0.607 * [1 - amount]) (0.769 - 0.769 * [1 - amount]) (0.189 - 0.189 * [1 - amount]) 0 0' +
                          '(0.349 - 0.349 * [1 - amount]) (0.686 + 0.314 * [1 - amount]) (0.168 - 0.168 * [1 - amount]) 0 0' +
                          '(0.272 - 0.272 * [1 - amount]) (0.534 - 0.534 * [1 - amount]) (0.131 + 0.869 * [1 - amount]) 0 0' +
                          '0 0 0 1 0"/>' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'amount' : amount
      },
      effectID;
    
    effectID = this.createFilter('sepia', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  addSaturation = function(el, amount) {
    el = findElement(el);

    var tplSource = '<filter id={{id}} class="saturate">' +
                      '<feColorMatrix type="saturate"' +
                        'values="(1 - {{amount}})"/>' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'amount' : amount
      },
      effectID;
    
    effectID = this.createFilter('saturate', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  addHueRotation = function(el, amount) {
    el = findElement(el);

    var tplSource = '<filter id="{{id}}" class="hue-rotate">' +
                      '<feColorMatrix type="hueRotate"' +
                        'values="{{angle}}"/>' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'amount' : amount
      },
      effectID;
    
    effectID = this.createFilter('hue-rotate', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  addInvert = function(el, amount) {
    el = findElement(el);

    var tplSource = '<filter id="{{id}}" class="invert">' +
                      '<feComponentTransfer>' +
                        '<feFuncR type="table" tableValues="{{amount}} (1 - {{amount}})"/>' +
                        '<feFuncG type="table" tableValues="{{amount}} (1 - {{amount}})"/>' +
                        '<feFuncB type="table" tableValues="{{amount}} (1 - {{amount}})"/>' +
                      '</feComponentTransfer>' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'amount' : amount
      },
      effectID;
    
    effectID = this.createFilter('invert', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  addOpacity = function(el, amount) {
    el = findElement(el);

    var tplSource = '<filter id={{id}} class="opacity">' +
                      '<feComponentTransfer>' +
                        '<feFuncA type="table" tableValues="0 {{amount}}"/>' +
                      '</feComponentTransfer>' +
                    '</filter>',
      template = Handlebars.compile(tplSource),
      config = {
        'amount' : amount
      },
      effectID;
    
    effectID = this.createFilter('opacity', config, template);
    el.style += 'filter: url(' + effectID + ')';
  },

  createFilter = function(filterName, config, template) {
    var filter,
        effectID,
        cachedFilter = findInCache(filterName, config);
    
    effectID = cachedFilter ? cachedFilter.filterId : generateFilterId(filterName);
    
    if (cachedFilter) {
      filtersContainer.append(cachedFilter);
    } else {
      addToCache(filterName, config, effectID);
      config.id = effectID;
      filter = template(config);
      filtersContainer.append(filter);
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
  },

  findElement = function(el) {
    if (el instanceof HTMLElement) {
      return el;
    } else if (typeof el === 'string') {
      return document.querySelector(el);
    } else {
      return null;
    }
  };

})();

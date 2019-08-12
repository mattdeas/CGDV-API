'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
    require('./visual/visual.add.controller'),
    require('./visual/visual.get.controller'),
    require('./visual/visual.modify.controller'),
    require('./visual/visual.delete.controller'),
    require('./visual/viscomment.add.controller'),
    require('./visual/viscomment.modify.controller'),
    require('./visual/viscomment.delete.controller'),
    require('./visual/common.controller'),
    require('./visual/vizOfDay.controller'),
    require('./visual/upvote.controller')
);

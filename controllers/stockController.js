//EDITED
const fetchModel = require('../models/fetchModel')

exports.getData = async (req, res, next) => {
    if (typeof req.query.stock === 'string') 
        fetchModel.fetchOne(req, res, next);
    else if (typeof req.query.stock === 'object')
        fetchModel.fetchTwo(req, res, next);
    else next();
};

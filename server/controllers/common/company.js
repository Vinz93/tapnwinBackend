/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Company from '../../models/common/company';

const CompanyController = {
  readAll(req, res, next) {
    const locals = req.app.locals;

    const offset = locals.config.paginate.offset(req.query.offset);
    const limit = locals.config.paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Company.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(companies => res.json(companies))
    .catch(next);
  },

  create(req, res, next) {
    Company.create(req.body)
    .then(mission => res.status(201).json(mission))
    .catch(next);
  },

  read(req, res, next) {
    Company.findById(req.params.company_id)
    .then(company => {
      if (!company)
        return res.status(404).end();

      res.json(company);
    })
    .catch(next);
  },

  update(req, res, next) {
    Company.findByIdAndUpdate(req.params.company_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(company => {
      if (!company)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },

  delete(req, res, next) {
    Company.findByIdAndRemove(req.params.company_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(next);
  },

  validate(req, res, next) {
    Company.findById(req.params.company_id)
    .then(company => {
      if (!company)
        return res.status(404).json('Company not found');

      next();
    })
    .catch(next);
  },
};

export default CompanyController;

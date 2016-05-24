/**
 * @author Juan Sanchez
 * @description Company controller definition
 * @lastModifiedBy Juan Sanchez
 */

import Company from '../../models/common/company';

const CompanyController = {

  readAll(req, res) {
    const locals = req.app.locals;

    const criteria = req.query.criteria || {};
    const offset = locals.config.offset(req.query.offset);
    const limit = locals.config.limit(req.query.limit);

    Company.paginate(criteria, {
      sort: {
        createdAt: 1,
      },
      offset,
      limit,
    })
    .then(companies => res.json(companies))
    .catch(err => res.status(500).send(err));
  },

  create(req, res) {
    Company.create(req.body)
    .then(mission => res.status(201).json(mission))
    .catch(err => {
      if (err.name === 'ValidationError')
        return res.status(400).json(err).end();

      return res.status(500).send(err);
    });
  },

  read(req, res) {
    Company.findById(req.params.company_id)
    .then(company => {
      if (!company)
        return res.status(404).end();
      res.json(company);
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  update(req, res) {
    Company.findByIdAndUpdate(req.params.company_id, req.body, {
      runValidators: true,
      context: 'query',
    })
    .then(company => {
      if (!company)
        return res.status(404).end();
      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  delete(req, res) {
    Company.findByIdAndRemove(req.params.company_id)
    .then(mission => {
      if (!mission)
        return res.status(404).end();

      res.status(204).end();
    })
    .catch(err => {
      if (err.name === 'CastError') {
        return res.status(400).send(err);
      }
      return res.status(500).send(err);
    });
  },

  // Middlewares

  check(req, res, next) {
    Company.findById(req.params.company_id)
    .then(company => {
      if (!company)
        return res.status(404).json('Company not found');

      next();
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);
      return res.status(500).send(err);
    });
  },
};

export default CompanyController;

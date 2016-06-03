/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Design from '../../models/design/design';

const VoteController = {
  create(req, res) {
    Design.findOneById(req.params.design_id)
    .then(design => {
      if (!design)
        return res.status(404).end();

      res.json(design);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },
};

export default VoteController;

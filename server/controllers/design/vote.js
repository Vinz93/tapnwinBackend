/**
 * @author Andres Alvarez
 * @description Company controller definition
 * @lastModifiedBy Andres Alvarez
 */

import Design from '../../models/design/design';

const VoteController = {
  create(req, res) {
    Design.findById(req.params.design_id)
    .then(design => {
      if (!design)
        return res.status(404).end();

      Object.assign(req.body, {
        player: res.locals.user._id,
      });

      const votes = design.votes;

      votes.push(req.body);

      design.save()
      .then(() => res.status(201).json(votes[votes.length - 1]))
      .catch(err => res.status(500).send(err));
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      return res.status(500).send(err);
    });
  },
  read(req, res) {
    const criteria = {
      _id: req.params.design_id,
    };

    Design.findOne(criteria)
    .then(design => {
      if (!design)
        return res.status(404).end();

      const vote = design.votes.find(vote => vote.player === res.locals.user._id);

      console.log(vote);

      res.json(vote);
    })
    .catch(err => {
      if (err.name === 'CastError')
        return res.status(400).send(err);

      res.status(500).send(err);
    });
  },
};

export default VoteController;

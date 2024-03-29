/**
 * @author Andres Alvarez
 * @description Asset controller definition
 * @lastModifiedBy Andres Alvarez
 */

import httpStatus from 'http-status';
import Promise from 'bluebird';

import { paginate, unlinkSync } from '../../helpers/utils';
import APIError from '../../helpers/api_error';
import Asset from '../../models/common/asset';

const AssetController = {
/**
 * @swagger
 * /assets:
 *   get:
 *     tags:
 *       - Assets
 *     description: Returns all assets
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: limit
 *         description: Return limit
 *         in: query
 *         required: false
 *         type: integer
 *       - name: offset
 *         description: Return offset
 *         in: query
 *         required: false
 *         type: integer
 *     responses:
 *       200:
 *         description: An array of assets
 *         schema:
 *           properties:
 *             docs:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/definitions/Asset'
 *                   - properties:
 *                       id:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *             total:
 *               type: integer
 *             limit:
 *               type: integer
 *             offset:
 *               type: integer
 */
  readAll(req, res, next) {
    const offset = paginate.offset(req.query.offset);
    const limit = paginate.limit(req.query.limit);

    const find = req.query.find || {};
    const sort = req.query.sort || { createdAt: 1 };

    Asset.paginate(find, {
      sort,
      offset,
      limit,
    })
    .then(assets => res.json(assets))
    .catch(next);
  },

/**
 * @swagger
 * /assets/{asset_id}:
 *   get:
 *     tags:
 *       - Assets
 *     description: Returns an asset
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: asset_id
 *         description: Asset's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: An asset
 *         schema:
 *           allOf:
 *              - $ref: '#/definitions/Asset'
 *              - properties:
 *                  id:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *                  updatedAt:
 *                    type: string
 *                    format: date-time
 */
  read(req, res, next) {
    Asset.findById(req.params.asset_id)
    .then(asset => {
      if (!asset)
        return Promise.reject(new APIError('Asset not found', httpStatus.NOT_FOUND));

      res.json(asset);
    })
    .catch(next);
  },

/**
 * @swagger
 * /assets/{asset_id}:
 *   patch:
 *     tags:
 *       - Assets
 *     description: Updates an asset
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: asset_id
 *         description: Asset's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: Asset
 *         description: Asset object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Asset'
 *     responses:
 *       201:
 *         description: Successfully updated
 */
  update(req, res, next) {
    let url;

    Asset.findById(req.params.asset_id)
    .then(asset => {
      if (!asset)
        return Promise.reject(new APIError('Asset not found', httpStatus.NOT_FOUND));

      url = asset.url;

      asset.set(req.body);

      return asset.save();
    })
    .then((asset) => {
      if (url !== asset.url)
        unlinkSync(req.app.locals.config, url);

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },

/**
 * @swagger
 * /assets/{asset_id}:
 *   delete:
 *     tags:
 *       - Assets
 *     description: Deletes an asset
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: asset_id
 *         description: Asset's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 */
  delete(req, res, next) {
    Asset.findByIdAndRemove(req.params.asset_id)
    .then(asset => {
      if (!asset)
        return Promise.reject(new APIError('Asset not found', httpStatus.NOT_FOUND));

      unlinkSync(req.app.locals.config, asset.url);

      res.status(httpStatus.NO_CONTENT).end();
    })
    .catch(next);
  },
};

export default AssetController;

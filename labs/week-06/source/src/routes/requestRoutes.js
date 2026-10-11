import { Router } from 'express';
import * as controller from '../controllers/requestController.js';
import { validateRequest } from '../middleware/validateRequest.js';
const router = Router();

router.get('/', controller.listRequests);
router.post('/', validateRequest, controller.createRequest);
router.get('/:id', controller.getRequest);
router.delete('/:id', controller.deleteRequest);

/**
 * TODO W06-R1 (CP02, CP04, CP05) · ประกาศ route ทั้งหมด
 *
 *   GET    /              → controller.listRequests
 *   POST   /              → validateRequest แล้วต่อด้วย controller.createRequest
 *   GET    /:id           → controller.getRequest
 *   PUT    /:id           → controller.updateRequestStatus     (⭐ Challenge)
 *   DELETE /:id           → controller.deleteRequest
 */

export default router;

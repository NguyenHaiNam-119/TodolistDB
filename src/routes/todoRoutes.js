const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);

router.get('/', todoController.getAllTodos);
router.get('/new', todoController.renderNewTodoForm);
router.post('/', todoController.createTodo);
router.get('/:id/edit', todoController.renderEditTodoForm);
router.post('/:id', todoController.updateTodo);
router.post('/:id/delete', todoController.deleteTodo);

module.exports = router; 
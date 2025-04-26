const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllTodos = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.render('todos/index', { todos, username: req.user.username });
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.render('todos/index', { error: 'Error fetching todos' });
  }
};

exports.createTodo = async (req, res) => {
  try {
    const { text } = req.body;
    await prisma.todo.create({
      data: {
        text,
        userId: req.user.id
      }
    });
    res.redirect('/todos');
  } catch (error) {
    console.error('Error creating todo:', error);
    res.redirect('/todos');
  }
};

exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;
    
    await prisma.todo.update({
      where: {
        id: parseInt(id),
        userId: req.user.id
      },
      data: { text, completed: completed === 'true' }
    });
    
    res.redirect('/todos');
  } catch (error) {
    console.error('Error updating todo:', error);
    res.redirect('/todos');
  }
};

exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.todo.delete({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });
    
    res.redirect('/todos');
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.redirect('/todos');
  }
};

exports.renderNewTodoForm = (req, res) => {
  res.render('todos/new');
};

exports.renderEditTodoForm = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
        userId: req.user.id
      }
    });
    
    if (!todo) {
      return res.redirect('/todos');
    }
    
    res.render('todos/edit', { todo });
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.redirect('/todos');
  }
}; 
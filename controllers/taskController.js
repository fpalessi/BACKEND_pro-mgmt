import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { project } = req.body;
  const checkProject = await Project.findById(project);
  if (!checkProject) {
    const error = new Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }
  // User adding task must be creator
  if (checkProject.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "No tienes los permisos necesarios para añadir tareas"
    );
    return res.status(403).json({ msg: error.message });
  }
  // Create task (after validations)
  try {
    const storagedTask = await Task.create(req.body);
    checkProject.tasks.push(storagedTask._id);
    await checkProject.save();
    res.json(storagedTask);
  } catch (error) {
    console.log(error);
  }
};
const getTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "Necesitas haber creado la tarea para poder acceder a ella"
    );
    return res.status(403).json({ msg: error.message });
  }
  res.json(task);
};
const updateTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "Necesitas haber creado la tarea para poder acceder a ella"
    );
    return res.status(403).json({ msg: error.message });
  }

  task.name = req.body.name || task.nombre;
  task.description = req.body.description || task.description;
  task.priority = req.body.priority || task.priority;
  task.deliveryDate = req.body.deliveryDate || task.deliveryDate;

  try {
    const storagedTask = await task.save();
    res.json(storagedTask);
  } catch (error) {
    console.log(error);
  }
};
const removeTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }
  if (task.project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "Necesitas haber creado la tarea para poder acceder a ella"
    );
    return res.status(403).json({ msg: error.message });
  }
  try {
    const project = await Project.findById(task.project);
    project.tasks.pull(task._id);
    await Promise.allSettled([await project.save(), await task.deleteOne()]);
    res.json({ msg: `La tarea ${task.name} fue eliminada` });
  } catch (error) {
    console.log(error);
  }
};
const changeTaskState = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id).populate("project");
  if (!task) {
    const error = new Error("Tarea no encontrada");
    return res.status(404).json({ msg: error.message });
  }
  if (
    task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error(
      "Necesitas ser o bien el creador o un colaborador para hacer esto"
    );
    return res.status(403).json({ msg: error.message });
  }
  task.state = !task.state;
  task.completed = req.user._id;
  await task.save();

  const storagedTask = await Task.findById(id)
    .populate("project")
    .populate("completed");

  res.json(storagedTask);
};

export { addTask, getTask, updateTask, removeTask, changeTaskState };

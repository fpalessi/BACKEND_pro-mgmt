import Project from "../models/Project.js";
import User from "../models/User.js";
// Get every project of the authenticated user
const getProjects = async (req, res) => {
  // req.user -> identifies authenticated user
  // .find() takes an array of conditions we want to check
  const projects = await Project.find({
    $or: [{ collaborators: { $in: req.user } }, { creator: { $in: req.user } }],
  }).select("-tareas");
  res.json(projects);
};
// Create new projects
const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;
  try {
    const storagedProject = await project.save();
    res.json(storagedProject);
  } catch (error) {
    console.log(error);
  }
};
// Shows a single project and its tasks.
const getSingleProject = async (req, res) => {
  const { id } = req.params;
  // x project with that id exists?
  const project = await Project.findById(id)
    .populate({
      path: "tasks",
      populate: { path: "completed", select: "name" },
    })
    .populate("collaborators", "name email");
  if (!project) {
    const error = new Error("No se ha encontrado ningún proyecto");
    return res.status(404).json({ msg: error.message });
  }
  // Are creator and the user who is trying to getSingleProject the same person? Or is he at least a collaborator?
  if (
    project.creator.toString() !== req.user._id.toString() &&
    !project.collaborators.some(
      (collaborator) => collaborator._id.toString() === req.user._id.toString()
    )
  ) {
    const error = new Error(
      "Acción NO válida, debe ser que tú no creaste este proyecto o ni seas colaborador"
    );
    return res.status(401).json({ msg: error.message });
  }
  res.json(project);
};
// We able to change its name, deliveryDate, ...
const editProject = async (req, res) => {
  // Same patron as previous: 1 -> read project (id, req.params); 2 -> verify existance; 3 -> only creator can modifies
  const { id } = req.params;

  const project = await Project.findById(id);
  if (!project) {
    const error = new Error("Proyecto no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // The user acessing to the project is he the creator or someone with permissons?
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error("Acción NO válida, tú no has creado este proyecto");
    return res.status(401).json({ msg: error.message });
  }

  // Time to update
  // What user is sending to update the project: req.body.name
  // What is already in db : project.name

  project.name = req.body.name || project.name;
  project.description = req.body.description || project.description;
  project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
  project.client = req.body.client || project.client;

  try {
    const storagedProject = await project.save();
    res.json(storagedProject);
  } catch (error) {
    console.log(error);
  }
};
const removeProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    const error = new Error("Proyecto a eliminar no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "Acción NO válida, necesitas haber creado un proyecto para poder eliminarlo"
    );
    return res.status(401).json({ msg: error.message });
  }
  try {
    await Project.deleteOne();
    res.json({ msg: "Proyecto eliminado con éxito" });
  } catch (error) {
    console.log(error);
  }
};
const searchCollaborator = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-confirmed -createdAt -password -token -updatedAt -__v "
  );

  if (!user) {
    const error = new Error("No existe ningún colaborador con ese correo");
    return res.status(404).json({ msg: error.message });
  }

  res.json(user);
};
const addCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // Just who created the project is able to add collaborators
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "Necesitas haber creado el proyecto para agregar colaboradores a él"
    );
    return res.status(404).json({ msg: error.message });
  }
  const { email } = req.body;
  const user = await User.findOne({ email }).select(
    "-confirmed -createdAt -password -token -updatedAt -__v "
  );
  // Does user exists?
  if (!user) {
    const error = new Error("Usuario no encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // Either creator or collaborator
  if (project.creator.toString() === user._id.toString()) {
    const error = new Error("El creador del proyecto no puede ser colaborador");
    return res.status(404).json({ msg: error.message });
  }
  // Already collaborator?
  if (project.collaborators.includes(user._id)) {
    const error = new Error("El usuario ya pertenece al proyecto");
    return res.status(404).json({ msg: error.message });
  }
  // Finally adding collaborator
  project.collaborators.push(user._id);
  await project.save();
  res.json({ msg: "Colaborador agregado con éxito" });
};
const removeCollaborator = async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    const error = new Error("Proyecto No Encontrado");
    return res.status(404).json({ msg: error.message });
  }
  // Only the project creator is able to remove collaborators
  if (project.creator.toString() !== req.user._id.toString()) {
    const error = new Error(
      "No puedes eliminar colaboradores si no has creado este proyecto"
    );
    return res.status(404).json({ msg: error.message });
  }
  // Finally removing the collaborator
  project.collaborators.pull(req.body.id);

  await project.save();
  res.json({ msg: "Colaborador eliminado con éxito" });
};

export {
  getProjects,
  newProject,
  getSingleProject,
  editProject,
  removeProject,
  searchCollaborator,
  addCollaborator,
  removeCollaborator,
};

import mongoose from "mongoose";
const projectSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    deliveryDate: {
      type: Date,
      default: Date.now(),
    },
    client: {
      type: String,
      trim: true,
      required: true,
    },
    // Creator is user type, ref: "User"
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Tasks is task type, ref: "Task". Array cause >=1
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, // esto nos crea las columnas de createdAt/updateAt
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;

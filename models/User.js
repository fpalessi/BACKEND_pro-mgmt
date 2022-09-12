import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    token: {
      type: String,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// Previous to save db user collection
userSchema.pre("save", async function (next) {
  // already hashed? skip
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  // this.password -> pass we want to hash, .hash(a,b) a-> string we are hashing, b-> salt
  this.password = bcrypt.hash(this.password, salt);
});
// Using fn declaration (.this) [vs arrow fn]
userSchema.methods.passwordChecker = async function (formPassword) {
  return await bcrypt.compare(formPassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;

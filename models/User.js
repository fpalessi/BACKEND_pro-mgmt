import mongoose from "mongoose";
// Hash pass
import bcrypt from "bcrypt";
// Schema: db structure
const userSchema = mongoose.Schema(
  {
    name: {
      // Atributes: type, required, trim
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
// Previous to save the user in db
userSchema.pre("save", async function (next) {
  // pass already hashed? skip
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  // this.password -> what we want to hash. hash(a,b) a-> string we are hashing, b-> salt
  this.password = bcrypt.hash(this.password, salt);
});
// Using fn declaration (.this) [vs arrow fn]
userSchema.methods.passwordChecker = async function (formPassword) {
  // bycrpt.compare() compares a hashed string with a no hashed one
  return await bcrypt.compare(formPassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;

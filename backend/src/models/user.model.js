import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username is already exist"],
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email is already exists"],
      trim: true,
      index: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: 6,
      select: false
    },
    verified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpire: Date
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {
    if (!this.isModified('password')) return 
    this.password = await bcrypt.hash(this.password, 10)

})

userSchema.methods.comparePassword = function (password) {
   return bcrypt.compare(password, this.password)
}

const users = mongoose.model("user", userSchema)
export default users
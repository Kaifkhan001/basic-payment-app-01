import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 6,
      maxlength: 18,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountToken: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);


const User = mongoose.model("User", userSchema);

export default User;
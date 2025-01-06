import mongoose,{ Schema } from 'mongoose';

const accountSchema = new Schema({
  userName: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true,
  }
});

const Account = mongoose.model("Account", accountSchema);

export default Account;
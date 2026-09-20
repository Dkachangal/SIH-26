const artisanProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  craftType: String,
  village:String,
  district:String,
  state: String,
  experience: Number,
  bio: String
});
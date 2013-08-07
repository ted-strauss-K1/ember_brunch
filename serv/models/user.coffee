module.exports.user = (mongoose) ->
  Schema = mongoose.Schema
  
  # schema for user 
  userSchema = new Schema(
    name: String
    email: String
  ,
    versionKey: false
  )
  
  # methods for userSchema 
  
  # userSchema.method({
  #   example: function () {
  #     return true;
  #   }
  # });
  mongoose.model "user", userSchema
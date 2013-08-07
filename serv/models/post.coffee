module.exports.post = (mongoose) ->
  Schema = mongoose.Schema
  
  # schema for post 
  postSchema = new Schema(
    title: String
    author: String
    intro: String
    extended: String
    publishedAt: Number
  ,
    versionKey: false
  )
  
  # methods for postSchema 
  
  # postSchema.method({
  #   example: function () {
  #     return true;
  #   }
  # });
  mongoose.model "post", postSchema
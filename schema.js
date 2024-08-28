const Joi=require('joi');

const userSchema=Joi.object({
    username:Joi.string().required(),
    email:Joi.string().email().required(),
    password:Joi.string().required().min(8).max(16),
    fullName:Joi.string().required(),
    about:Joi.string().required(),
});

const pinSchema=Joi.object({
  title:Joi.string().required(),
  description:Joi.string().optional().allow(''),
  board:Joi.string().optional(),
  allowComments:Joi.boolean().optional(),
  
});

const commentSchema = Joi.object({
    comment: Joi.string().min(1).required()
  });

  const boardSchema=Joi.object({
    name:Joi.string().required(),
    description:Joi.string().optional().allow(''),
    isSecret:Joi.boolean().optional(),
  })

module.exports={userSchema,commentSchema,pinSchema,boardSchema}
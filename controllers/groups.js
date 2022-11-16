import { Unauthorised } from '../config/errors.js'
import { findDocument, sendErrors } from '../config/helpers.js'
import Group from '../models/group.js'

//POST GROUP
export const addGroup = async (req, res) => {
  try {
    const newOwnedGroup = { ...req.body, owner: req.currentUser._id }
    const newGroup = await Group.create(newOwnedGroup)
    console.log(newGroup)
    res.status(201).json(newGroup)
  } catch (err) {
    sendErrors(res, err)
  }
}

//GET ALL GROUPS
export const getAllGroups = async (_req, res) => {
  try {
    const groups = await Group.find().populate('owner')
    // groups = groups.map(group => {
    //   const newGroup = { ...group }
    //   delete newGroup.posts
    //   return newGroup
    // })
    console.log(groups)
    return res.json(groups)
  } catch (err) {
    sendErrors(res, err)
  }
}

//GET 1 GROUP
// ? NEED TO ADD comments.owner TO POPULATE comment owners
export const getSingleGroup = async (req, res) => {
  try {
    const group = await findDocument(Group, 'groupId', req, res, ['owner'])
    return res.json(group)
  } catch (err) {
    sendErrors(res, err)
  }
}

export const updateGroup = async (req, res) => {
  try {
    const targetGroup = await findDocument(Group, 'groupId', req, res)
    if (targetGroup && targetGroup.owner.equals(req.currentUser._id)){
      Object.assign(targetGroup, req.body)
      targetGroup.save()
      return res.status(202).json(targetGroup)
    }
    throw new Unauthorised()
  } catch (err) {
    sendErrors(res, err)
  }
}

export const deleteGroup = async (req, res) => {
  try {
    const targetGroup = await findDocument(Group, 'groupId', req, res)
    if (targetGroup && targetGroup.owner.equals(req.currentUser._id)){
      await targetGroup.remove()
      console.log('removed')
      return res.sendStatus(204)
    }
    throw new Unauthorised()
  } catch (err) {
    sendErrors(res, err)
  }
}


// // POSTS

// //GET ALL POSTS
// export const getAllPosts = async (req, res) => {
//   try {
//     const group = await findDocument(Group, 'groupId', req, res, ['owner'])
//     console.log(group.posts)
//     return res.json(groups)
//   } catch (err) {
//     sendErrors(res, err)
//   }
// }
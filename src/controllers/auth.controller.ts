import { User } from "../schemas/User"
import { Controller } from "../utilities/types"

export const getAuth: Controller = async (req, res) => {
  const user = new User()
  user.firstName = "Timber"
  user.lastName = "Saw"
  user.age = 25
  await user.save()
  res.send("A group of users")
}

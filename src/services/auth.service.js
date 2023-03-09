import userService from './user.service.js';
import bcrypt from 'bcrypt';

class AuthServices {
  async login(email, password) {
    try {
      
      const user = await userService.getUser(email);

      if (!user) {
        throw new Error('User not found')
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        throw new Error('Wrong password')
      }
     
      return user
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

const authServices = new AuthServices();
export default authServices;
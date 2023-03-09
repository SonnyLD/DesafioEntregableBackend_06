import { UserModel } from '../dao/models/users.models.js';
import { Strategy }  from 'passport-local';
import UserService from "../services/user.service.js";
import authServices from '../services/auth.service.js'
import passportGithub from 'passport-github2';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

passport.serializeUser(function (user, done) {
  console.log("Serializing");
  done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
  console.log("Deserializing");
  UserModel.findById(_id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  "signup",
  new Strategy({ passReqToCallback: true, usernameField: "email" }, async function (
    req,
    username,
    password,
    done,
  ) {
    try {
      console.log("req.body:", req.body);
      const userExist = await UserModel.findOne({ email: username });
      console.log("userExist:", userExist);

      if (userExist) {
        console.log("User already exists");
        return done("El usuario ya existe", false);

      } else {
        const userData = {
          first_name: req.body.firstName,
          last_name: req.body.lastName,
          email: req.body.email,
          password: req.body.password,
          age: req.body.age,
        };
        console.log("userData:", userData);
        const user = await UserService.createUser(userData);

        console.log("User created:", user);
        return done(null, user);
      }
    } catch (error) {
      console.error("Error creating user:", error.message);
      throw new Error(error.message);
    }
  }),
);


passport.use("login", 
new Strategy({passReqToCallback:true, usernameField:'email'}, async function (
  req,
  username,
  password,
  done
  
  ) {
 
  try {
      const user = await UserModel.findOne({ email: username });
      
      if (!user) {
        return done(null, false, { message: 'User not found', email: username });
      }
      const login = await authServices.login(username, password)
      if (login) {
        return done(null, user);
    } else {
      return done(null,false, { message: 'Invalid password' })
    }
  } catch (error) {
    return done(error);
  }
}));
  passport.use(
    'github',
    new passportGithub.Strategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8081/api/github/callback', // This should be changed accordingly to the environment and stage of the proyect
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await UserService.getUser(profile._json.email);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              
          if (!user) {
            const names = [
              profile.displayName.split(' ')[0],
              profile.displayName.split(' ')[1],
            ]; // Asuming only one name
            const userData = {
              firstName: names[0],
              lastName: names[1],
              email: profile._json.email,
              age: 20,
              password: '',
              platform: 'github',
            };
            const newUser = await UserService.createUser(userData);
            return done(null, newUser);
          }

          delete user.password;

          done(null, user);
        } catch (error) {
          throw new Error(error.message);
        }
      }
    )
  );


export default passport;
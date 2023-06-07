import passport from 'passport';
import local from 'passport-local';
import userService from '../dao/models/User.model.js';
import { createHash, validatePassword } from '../utils.js';
import GitHubStrategy from 'passport-github2';

const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            let { first_name, last_name, email, rol, age } = req.body;
            try {
                const user = await userService.findOne({ email: username });
                if (user) {
                    console.log('El usuario existe');
                    return done(null, false);
                }
                if ((email === 'adminCoder@coder.com') && (password === 'adminCod3r123')) {
                    rol = 'Admin';
                } else {
                    rol = 'User';
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    rol,
                    age,
                    password: createHash(password)
                }

                const result = await userService.create(newUser);
                return done(null, result);

            } catch (error) {
                return done("Error al registrar el usuario: " + error);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user._id)
    });
    passport.deserializeUser(async (id, done) => {
        const user = await userService.findById(id);
        done(null, user)
    });

    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {

        try {
            const user = await userService.findOne({ email: username })
            //console.log(user);
            if (!user) {
                console.log('No existe el usuario');
                return done(null, false);
            }
            if (!validatePassword(password, user)) return done(null, false);
            return done(null, user);

        } catch (error) {
            return done("Error al intentar ingresar: " + error);
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.2c464452d85447cd',
        clientSecret: '5ade14c36c79387e3e1e225e05bf2a55f4bf5e49',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'

    }, async (accesToken, refreshToken, profile, done) => {
        try {

            console.log(profile); //vemos toda la info que viene del profile
            let user = await userService.findOne({ email: profile._json.email })
            if (!user) {

                const email = profile._json.email == null ? profile._json.username : null;

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    name: profile._json.name,
                    email: email,
                    age: 18,
                    password: '',
                    rol: profile._json.type
                }
                const result = await userService.create(newUser);
                done(null, result)
            } else {
                //ya existe
                done(null, user)
            }

        } catch (error) {
            return done(null, error)
        }
    }))
}

export default initializePassport;
import user from "../models/user.js";
import role from "../models/role.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from "moment";
import transporter from "../middlewares/mailer.js";

const registerUser = async(req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password)
        return res.status(400).send({ message: "Incomplete data" });

    const existingUser = await user.findOne({ email: req.body.email });
    if (existingUser)
        return res.status(400).send({ message: "The user is already registered" });

    const passHash = await bcrypt.hash(req.body.password, 10);

    const roleId = await role.findOne({ name: "user" });
    if (!role) return res.status(400).send({ message: "No role was assigned" });

    const userRegister = new user({
        name: req.body.name,
        email: req.body.email,
        password: passHash,
        roleId: roleId._id,
        dbStatus: true,
    });

    const result = await userRegister.save();

    try {
        return res.status(200).json({
            token: jwt.sign({
                    _id: result._id,
                    name: result.name,
                    roleId: result.roleId,
                    iat: moment().unix(),
                },
                process.env.SK_JWT
            ),
        });
    } catch (e) {
        return res.status(400).send({ message: "Register error" });
    }
};

const registerAdminUser = async(req, res) => {
    if (!req.body.name ||
        !req.body.email ||
        !req.body.password ||
        !req.body.roleId
    )
        return res.status(400).send({ message: "Incomplete data" });

    const existingUser = await user.findOne({ email: req.body.email });
    if (existingUser)
        return res.status(400).send({ message: "The user is already registered" });

    const passHash = await bcrypt.hash(req.body.password, 10);

    const userRegister = new user({
        name: req.body.name,
        email: req.body.email,
        password: passHash,
        roleId: req.body.roleId,
        dbStatus: true,
    });

    const result = await userRegister.save();
    return !result ?
        res.status(400).send({ message: "Failed to register user" }) :
        res.status(200).send({ result });
};

const listUsers = async(req, res) => {
    const userList = await user
        .find({
            $and: [
                { name: new RegExp(req.params["name"], "i") },
                { dbStatus: "true" },
            ],
        })
        .populate("roleId")
        .exec();
    return userList.length === 0 ?
        res.status(400).send({ message: "Empty users list" }) :
        res.status(200).send({ userList });
};

const listAllUser = async(req, res) => {
    const userList = await user
        .find({
            $and: [{ name: new RegExp(req.params["name"], "i") }],
        })
        .populate("roleId")
        .exec();
    return userList.length === 0 ?
        res.status(400).send({ message: "Empty users list" }) :
        res.status(200).send({ userList });
};

const findUser = async(req, res) => {
    const userfind = await user
        .findById({ _id: req.params["_id"] })
        .populate("roleId")
        .exec();
    return !userfind ?
        res.status(400).send({ message: "No search results" }) :
        res.status(200).send({ userfind });
};

const getUserRole = async(req, res) => {
    let userRole = await user
        .findOne({ email: req.params.email })
        .populate("roleId")
        .exec();
    if (!userRole)
        return res.status(400).send({ message: "No search results" });

    userRole = userRole.roleId.name;
    return res.status(200).send({ userRole });
};

const updateUser = async(req, res) => {
    if (!req.body.name || !req.body.email || !req.body.roleId)
        return res.status(400).send({ message: "Incomplete data" });

    const searchUser = await user.findById({ _id: req.body._id });
    if (req.body.email !== searchUser.email)
        return res
            .status(400)
            .send({ message: "The email should never be changed" });

    let pass = "";

    if (req.body.password) {
        const passHash = await bcrypt.compare(
            req.body.password,
            searchUser.password
        );
        if (!passHash) {
            pass = await bcrypt.hash(req.body.password, 10);
        } else {
            pass = searchUser.password;
        }
    } else {
        pass = searchUser.password;
    }

    const existingUser = await user.findOne({
        name: req.body.name,
        email: req.body.email,
        password: pass,
        roleId: req.body.roleId,
    });
    if (existingUser)
        return res.status(400).send({ message: "you didn't make any changes" });

    const userUpdate = await user.findByIdAndUpdate(req.body._id, {
        name: req.body.name,
        email: req.body.email,
        password: pass,
        roleId: req.body.roleId,
    });

    return !userUpdate ?
        res.status(400).send({ message: "Error editing user" }) :
        res.status(200).send({ message: "User updated" });
};

const deleteUser = async(req, res) => {
    const userDelete = await user.findByIdAndDelete({ _id: req.params["_id"] });
    return !userDelete ?
        res.status(400).send({ message: "user no found" }) :
        res.status(200).send({ message: "user deleted" });
};

const login = async(req, res) => {
    if (!req.body.email || !req.body.password)
        return res.status(400).send({ message: "Incomplete data" });

    const userLogin = await user.findOne({ email: req.body.email });
    if (!userLogin)
        return res.status(400).send({ message: "Wrong email or password" });

    const hash = await bcrypt.compare(req.body.password, userLogin.password);
    if (!hash)
        return res.status(400).send({ message: "Wrong email or password" });

    try {
        return res.status(200).json({
            token: jwt.sign({
                    _id: userLogin._id,
                    name: userLogin.name,
                    roleId: userLogin.roleId,
                    iat: moment().unix(),
                },
                process.env.SK_JWT
            ),
        });
    } catch (e) {
        return res.status(400).send({ message: "Login error" });
    }
};

const forgotPassword = async(req, res) => {
    if (!req.body.password || !req.body.password2)
        return res.status(400).send({ message: "Incomplete data" });

    const searchUser = await user.findById({ _id: req.body._id });

    let pass = "";
    if (req.body.password == req.body.password2) {
        const passHash = await bcrypt.compare(
            req.body.password,
            searchUser.password
        );
        if (!passHash) {
            pass = await bcrypt.hash(req.body.password, 10);
        } else {
            return res.status(400).send({
                message: "the password must be different from the previous ones",
            });
        }
    } else {
        return res.status(400).send({
            message: "Passwords do not match",
        });
    }

    const userUpdate = await user.findByIdAndUpdate(req.body._id, {
        password: pass,
    });

    return !userUpdate ?
        res.status(400).send({ message: "error retrieving password" }) :
        res.status(200).send({ message: "password recovered" });
};

const sendPassword = async(req, res) => {
    if (!req.body.email)
        return res.status(400).send({ message: "Incomplete data" });

    const searchUser = await user.findOne({ email: req.body.email });
    if (!searchUser)
        return res.status(400).send({ message: "email does not exist" });

    try {
        const token = jwt.sign({
                _id: searchUser._id,
                name: searchUser.name,
                roleId: searchUser.roleId,
                iat: moment().unix(),
            },
            process.env.SK_JWT, {
                expiresIn: "10m",
            }
        );
        let verificationLink = "http://localhost:4200/forgotPassword/" + searchUser._id;
        const info = await transporter.sendMail({
            from: '"Debbel 👻" <joya1028@gmail.com>',
            to: searchUser.email,
            subject: "Forgot password? ✔",
            html: `
      <p>Hello ${searchUser.name} </p>
      <p>if you want to reset your password</p>
      <p>Please enter on the follow link</p>
      <br>
      <a href="${verificationLink}">${verificationLink}</a>
      `,
        });
        return !info ?
            res.status(400).send({ message: "error sending mail" }) :
            res.status(200).send({ message: "email sent", token });
    } catch (e) {
        return res.status(400).send({ message: "Token error " + e });
    }
};

const findUserPass = async(req, res) => {
    const userfind = await user
        .findById({ _id: req.params["_id"] })
        .populate("roleId")
        .exec();
    return !userfind ?
        res.status(400).send({ message: "No search results" }) :
        res.status(200).send({ userfind });
};

export default {
    registerUser,
    registerAdminUser,
    listUsers,
    listAllUser,
    findUser,
    updateUser,
    deleteUser,
    login,
    getUserRole,
    forgotPassword,
    sendPassword,
    findUserPass,
};
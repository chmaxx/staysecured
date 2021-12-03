const bcrypt = require('bcrypt');
const uuid = require('uuid');

const UserModel = require('./user/model');
const UploadModel = require('../../lib/Uploader/model');
const MailService = require('../../lib/Mailer');
const Tokens = require('./tokens');
const ApiError = require('../../lib/ApiError');

class UserService {
  static async registration(login, firstName, lastName, email, password) {
    const candidate = await UserModel.findOne({ $or: [{ email }, { login }] });

    if (candidate) {
      throw ApiError.BadRequest(
        // :)))
        `Пользователь с ${
          candidate.email == email ? 'такой почтой' : 'таким логином'
        } уже существует!`
      );
    }

    const activationUUID = uuid.v4();
    const passwordHashed = await bcrypt.hash(password, 3);

    const user = await UserModel.create({
      login,
      firstName,
      lastName,
      email,
      passwordHashed,
      activationUUID,
    });

    // TODO: генерацию ссылки по данным из конфига желательно вынести в отдельный middleware
    await MailService.sendActivationMail(
      email,
      `localhost:${api_config.port}/${api_config.api_version}/users/activate/${activationUUID}`
    );

    return await Tokens.registerUserTokens(user);
  }

  static async activate(activationUUID) {
    const user = await UserModel.findOne({ activationUUID });

    if (!user) throw ApiError.BadRequest('Некорректная ссылка активации');
    if (user.isActivated) throw ApiError.BadRequest('Пользователь уже активирован!');

    user.isActivated = true;
    await user.save();
  }

  static async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) throw ApiError.BadRequest('Такого пользователя не существует!');

    const isPassEquals = await bcrypt.compare(password, user.passwordHashed);
    if (!isPassEquals) throw ApiError.BadRequest('Некорректный пароль!');

    return await Tokens.registerUserTokens(user);
  }

  static async logout(refreshToken) {
    const token = await Tokens.removeRefreshToken(refreshToken);
    return token;
  }

  static async changePassword(userID, oldPassword, newPassword) {
    if (oldPassword == newPassword)
      throw ApiError.BadRequest('Новый пароль не может совпадать со старым!');

    const user = await UserModel.findById(userID);
    const isPassEquals = await bcrypt.compare(oldPassword, user.passwordHashed);

    if (!isPassEquals) throw ApiError.BadRequest('Неправильный старый пароль!');

    user.passwordHashed = await bcrypt.hash(newPassword, 3);
    await user.save();

    return await Tokens.registerUserTokens(user);
  }

  static async changeAvatar(userID, uploadID) {
    const user = await UserModel.findById(userID);
    const upload = await UploadModel.findById(uploadID);

    if (!upload) throw ApiError.BadRequest('Данного файла не существует!');

    user.avatar = upload._id;
    await user.save();
  }

  static async getInfo(userID) {
    const user = await UserModel.findById(userID, {
      firstName: 1,
      lastName: 1,
      login: 1,
      usergroup: 1,
      avatarUploadID: 1,
    });

    if (!user) throw ApiError.BadRequest('Такого пользователя не существует!');

    return user;
  }

  static async refresh(refreshToken) {
    if (!refreshToken) throw ApiError.Unauthorized();

    const validationData = await Tokens.validateRefreshToken(refreshToken);
    if (!validationData) throw ApiError.Unauthorized();

    return await Tokens.registerUserTokens(validationData.user);
  }
}

module.exports = UserService;

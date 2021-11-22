const UserService = require('./service');
const { ResponseMessage } = require('../utils');

class UserController {
  static async register(req, res, next) {
    try {
      const { login, firstName, lastName, email, password } = req.body;
      const userData = await UserService.registration(
        login,
        firstName,
        lastName,
        email,
        password
      );

      // мы должны умножать maxAge на 1000, поскольку в аргументах ожидаются мс (а в конфиге секунды)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: api_config.jwt.refresh_token_lifetime * 1000,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: api_config.jwt.refresh_token_lifetime * 1000,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });

      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);

      res.clearCookie('refreshToken');

      return res.json(token);
    } catch (e) {
      next(e);
    }
  }

  static async changePassword(req, res, next) {
    try {
      const { accessToken, refreshToken } = await UserService.changePassword(
        req.user._id,
        req.body.oldPassword,
        req.body.newPassword
      );

      res.cookie('refreshToken', refreshToken, {
        maxAge: api_config.jwt.refresh_token_lifetime * 1000,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });

      return res.json(
        ResponseMessage('Успешная смена пароля!', { accessToken, refreshToken })
      );
    } catch (e) {
      next(e);
    }
  }

  static async changeAvatar(req, res, next) {
    try {
      await UserService.changeAvatar(req.user._id, req.body.upload_id);
      return res.json(ResponseMessage('Аватарка успешно обновлена!'));
    } catch (e) {
      next(e);
    }
  }

  static async getInfo(req, res, next) {
    const user = req.user;
    return res.json({
      login: user.login,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActivated: user.isActivated,
      usergroup: user.usergroup,
      avatarUploadID: user.avatar,
    });
  }

  static async activate(req, res, next) {
    try {
      const activationLink = req.params.link;
      await UserService.activate(activationLink);

      // TODO: редирект
      return res.json(ResponseMessage('Аккаунт успешно активирован!'));
    } catch (e) {
      next(e);
    }
  }

  static async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: api_config.jwt.refresh_token_lifetime * 1000,
        httpOnly: true,
        sameSite: 'Strict',
        secure: true,
      });

      res.json(userData);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = UserController;

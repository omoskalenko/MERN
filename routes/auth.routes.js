const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = Router();
const JWT = require('jsonwebtoken')
const config  = require('config')

router.post(
  "/register",
  // Мидлвары для валидации данных с помощью express-validator
  [
    check("email", "Некорректный email").isEmail(),
    check("password", "Минимальная длина пароля 6 символов").isLength({
      min: 6
    })
  ],
  async (req, res) => {
    try {
      // валидация данных с помощью express-validator
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Некорректные данные при регистрации"
        });
      }

      const { email, password } = req.body;

      // Проверяем существует ли уже такой пользователь
      const candidate = await User.findOne({ email })
      if (candidate) {
        res.status(400).json({ message: "Такой пользователь уже существует" })
        return;
      }

      // Хэшируем пароль
      const hashedPswd = await bcrypt.hash(password, 12)
      // Создаем пользователя
      const user = new User({ email, password: hashedPswd })
      //Сохраняем пользователя
      await user.save();

      res.status(201).json({ message: "Пользователь создан" })
    } catch (error) {
      res
        .status(500)
        .json({ message: "Что то пошло не так, попробуйте снова" })
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Введите корректный email").normalizeEmail().isEmail(),
    check("password", "Введите пароль").exists()
  ],
  async (req, res) => {
    try {
      // валидация данных с помощью express-validator
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
        return res.satus(400).json({
          errors: errors.array(),
          message: "Некорректные данные при входе"
        });
      }

      const { email, password } = req.body

      const user = await User.findOne({ email })

      // Проверка пользователя и пароля, необходимо объеденять в одну и возвращать ответ что не неверные имя пользователя или пароль

      if(!user) {
        return res.status(400).json({ message: 'Пользователь не найден' })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль' })
      }

      // JWT
      const token = JWT.sign(
        { userIs: user.id },
        config.get('jwtSecret'),
        { expiresIn: '1h' },
      )

      res.json({ token, userId: user.id })

    } catch (error) {
      res
        .status(500)
        .json({ message: "Что то пошло не так, попробуйте снова" });
    }
  }
);

module.exports = router;
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña requeridos' });
      return;
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: 'El usuario ya existe' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      email,
      passwordHash,
    });

    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: newUser._id,
        email: newUser.email,
        creditsBalance: newUser.creditsBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ error: 'Credenciales inválidas' });
      return;
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        email: user.email,
        creditsBalance: user.creditsBalance,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
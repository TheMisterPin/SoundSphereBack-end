import { Response, Request } from "express";
import prismaClient from "../db/client";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prismaClient.user.findMany({});
    

    res.status(201).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};


export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    let user = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (user) {
      const userId = user.id;
      return res.status(200).json({ userId });
    }
    if (!user) {
      user = await prismaClient.user.create({
        data: { name, email },
      });
      return res.status(201).json(user);
    }
  } catch (error) {
    console.error("Error creando/buscando usuario:", error);
    res.status(500).json({ error: "Error al buscar/crear el usuario" });
  } finally {
    await prismaClient.$disconnect();
  }
};


export const userUpdateDataController = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existingUser) {
      return res.status(401).send({ errors: ["Usuario no existente"] });
    }

    const updatedUser = await prismaClient.user.update({
      where: {
        email: existingUser.email,
      },
      data: {
        name,
      },
    });

    return res.send({ log: ["Usuario actualizado"] });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send({ errors: ["Error al actualizar usuario"] });
  } finally {
    await prismaClient.$disconnect();
  }
};

export default userUpdateDataController;

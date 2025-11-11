import { RequestHandler } from "express";
import { UserInfo } from "@shared/schedule";

export const handleGetUser: RequestHandler = (req, res) => {
  const { id } = req.params;
  
  const mockUser: UserInfo = {
    id: id,
    name: "Вячеслав",
    isAdmin: true
  };
  
  res.json(mockUser);
};

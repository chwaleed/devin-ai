import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyDbp4fn4t7JkSrE-DJcvijZweGaZrlMFW8");

export const generateAiResponse = async ({
  prompt,
  io,
  roomId,
}: {
  prompt: string;
  io: any;
  roomId: string;
}) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent(prompt);

  const text = result.response.text();
  io.to(roomId).emit("project-message", {
    message: text,
    sender: "AI",
  });
};

import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { content, author, postId } = req.body;

  if (!content || !author || !postId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Mock comment object
  const newComment = {
    id: Date.now(), // simulate ID
    content,
    author,
    postId,
    createdAt: new Date().toISOString(),
  };

  console.log("New comment received:", newComment);

  return res.status(200).json(newComment);
}
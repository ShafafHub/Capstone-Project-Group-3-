export const success = (res, data) => 
   res.json(data);

export const error = (res, msg) =>
    res.status(400).json({ message: msg });
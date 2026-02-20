export const submitForm = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);

    if (!req.file) {
      return res.status(400).json({ error: "File is required" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

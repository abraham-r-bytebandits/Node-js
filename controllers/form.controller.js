export const submitForm = async (req, res) => {
  try {
    console.log("Incoming Form Data:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    return res.status(200).json({
      success: true,
      message: "Form received successfully",
      data: {
        ...req.body,
        uploadedFile: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Submit Form Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

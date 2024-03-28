
const adminLogin = async (req, res) => {
    // Fixed email and password
    try {
        const fixedEmail = "admin@example.com";
        const fixedPassword = "password";

        // Get the email and password from the request body
        const { email, password } = req.body;

        // Check if the provided email and password match the fixed values
        if (email === fixedEmail && password === fixedPassword) {
            res.status(200).json({ success: true, message: "Login successful" });
        } else {
            res.status(401).json({ success: false, message: "Invalid email or password" });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json("Internal Server Error");
    }
}

module.exports = { adminLogin };
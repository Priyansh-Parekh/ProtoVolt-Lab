import Circuit from "../../models/circuits.js";


const getCircuits = async (req, res) => {
    try {

        const user = req.user;

        if (!user) return res.status(400).json({
            success: false,
            message: "Unauthorized Ascess"
        });

        await user.populate({
            path: 'circuits',
            select: 'name createdAt' // only fetch the name, remove _id if you want
        });

        const circuits = user.circuits || [];
        return res.status(200).json({
            success: true,
            message: "Successfully fetched all circuits",
            circuits
        });


    } catch (err) {
        console.error("Error fetching circuits:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

export default getCircuits
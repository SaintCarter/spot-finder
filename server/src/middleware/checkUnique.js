import { supabase } from '../config/supabase.js';

export default async function checkUniqueLogin(req, res, next) {
    const { username, phoneNumber } = req.body;

    // Use a try-catch for extra safety
    try {
        const { data, error } = await supabase
            .from('users')
            .select('username, phone')
            .or(`username.eq."${username}",phone.eq."${phoneNumber}"`) 
            .maybeSingle();

        if (error) throw error;

        if (data) {
            const isUsernameMatch = data.username?.toLowerCase() === username?.toLowerCase();
            const isPhoneMatch = data.phone === phoneNumber;

            if (isUsernameMatch) return res.status(400).json({ message: "Username is already taken" });
            if (isPhoneMatch) return res.status(400).json({ message: "Phone number is already taken" });
        }

        next();
    } catch (err) {
        console.error('CheckUnique Error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
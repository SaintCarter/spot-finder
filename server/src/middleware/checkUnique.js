import { supabase } from '../config/supabase.js';

export default async function checkUniqueLogin(req, res, next) {
    const { username, email } = req.body;

    // Use a try-catch for extra safety
    try {
        const { data, error } = await supabase
            .from('users')
            .select('username, email')
            .or(`username.eq."${username}",email.eq."${email}"`) 
            .maybeSingle();

        if (error) throw error;

        if (data) {
            const isUsernameMatch = data.username?.toLowerCase() === username?.toLowerCase();
            const isEmailMatch = data.email === email;

            if (isUsernameMatch) return res.status(400).json({ message: "Username is already taken" });
            if (isEmailMatch) return res.status(400).json({ message: "Email is already taken" });
        }

        next();
    } catch (err) {
        console.error('CheckUnique Error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
}
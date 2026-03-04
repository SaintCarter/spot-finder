import { supabase } from '../config/supabase.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('id, username, password_hash')
            .eq('username', username)
            .maybeSingle();

        if (error) throw error;

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const passwordsMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordsMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const JWT_SECRET = process.env.JWT_SECRET;
        const token = jwt.sign(
            { 
                userId: user.id,
                username: user.username 
            }, 
            JWT_SECRET, 
            { expiresIn: '1h' } 
        );

        return res.cookie('spotfinder_access_token', token, {
            httpOnly: true,    
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax',    
            maxAge: 60 * 60 * 1000 // 1 hour 
        }).status(200).json({ 
            message: "Account logged in successfully!", 
            userId: user.id, 
            username: user.username 
        });

    } catch (err) {
        console.error('Login Error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
};



export const logout = (req, res) => {
    res.clearCookie('spotfinder_access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    return res.status(200).json({
        message: "bye!"
    });
};
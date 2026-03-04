import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { get } from 'http';
import jwt from 'jsonwebtoken';

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: dashboardData, error } = await supabase
      .from('user_dashboard')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error("Supabase Error:", error.message);
      return res.status(500).json({ error: "Failed to fetch dashboard data." });
    }

    if (!dashboardData) {
      return res.status(404).json({ message: "Dashboard not found." });
    }

    res.status(200).json({ 
      message: "Here's your dashboard data!",
      bio: dashboardData.bio
    });

  } catch (err) {
    console.error("Server Crash:", err);
    res.status(500).json({ error: "Internal server error." });
  }
};


export const createAccount = async (req, res) => {
  const { username, password, phoneNumber } = req.body;
  
  try {
    const uuid = crypto.randomUUID();
    const saltRounds = 10;
    const passwordHashed = bcrypt.hashSync(password, saltRounds);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        { 
          id: uuid,
          username: username,
          password_hash: passwordHashed,
          phone: phoneNumber,
        },
      ])
      .select();

    if (userError) throw userError;

    const { error: dashboardError } = await supabase
      .from('user_dashboard')
      .insert([
        { 
          user_id: uuid, 
          bio: "My Bio" 
        }
      ]);

    if (dashboardError) throw dashboardError;

    return res.status(200).json({ 
      message: "Account and Dashboard created successfully!", 
      username: userData[0].username
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      message: "Failed to create account", 
      error: error.message 
    });
  }
};

export const getSettings = async (req, res) => {
  res.status(200).json({
    message: "this isnt set up yet!"
  });
}
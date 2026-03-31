import { supabase } from '../config/supabase.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { get } from 'http';
import jwt from 'jsonwebtoken';

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { data: dashboardData, error: dashboardError } = await supabase
      .from('user_dashboard')
      .select('*')
      .eq('userid', userId)
      .maybeSingle();

    if (dashboardError) {
      console.error("dash Error:", dashboardError.message);
      return res.status(500).json({ error: "Failed to fetch dashboard data." });
    }

    if (!dashboardData) {
      return res.status(404).json({ message: "Dashboard not found." });
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('favouriteboardurl')
      .eq('id', userId)
      .maybeSingle();
    if (userError) {
      return res.status(500).json({ error: "Failed to fetch user data." });
    }

    if (!userData) {
      return res.status(404).json({ message: "User not found." });
    }
    

    res.status(200).json({ 
      message: "Here's your dashboard data!",
      bio: dashboardData.bio,
      image: userData.favouriteboardurl,
    });

  } catch (err) {
    res.status(500).json({ error: "Internal server error." });
  }
};





export const createAccount = async (req, res) => {
  const { username, password, email } = req.body;
  const defaultBoard = '/images/skatemap.png';

  try {
    const saltRounds = 10;
    const passwordHashed = bcrypt.hashSync(password, saltRounds);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          username: username,
          passwordhashed: passwordHashed,
          email: email,
          favouriteboardurl: defaultBoard || null,
        },
      ])
      .select();

    if (userError) throw userError;

    //init dashboard 
    const { error: dashboardError } = await supabase
      .from('user_dashboard')
      .insert([
        { 
          userid: userData[0].id, 
          bio: "My Bio" 
        }
      ]);

    if (dashboardError) throw dashboardError;


    return res.status(200).json({ 
      message: "Account and Dashboard created successfully!", 
      username: userData[0].username
    });

  } catch (error) {
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
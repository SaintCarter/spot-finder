import { supabase } from '../config/supabase.js';


export const addBoardCheck = async (req, res) => {
    const boardUrl = req.processedImageUrl;
    res.status(200).json({success: true, boardUrl: boardUrl });
} 

export const addBoard = async (req, res) => {
    const { boardUrl } = req.body;
    const userId = req.user.userId;
      try {
 
    
        const { error: boardError } = await supabase
          .from('users_skateboard')
          .insert([
            { 
              usersid: userId, 
              boardurl: boardUrl,
            }
          ]);
    
        if (boardError) throw boardError;
    
    
        return res.status(200).json({ 
          success: true, message: "Board uploaded successfully!"
        });
    
      } catch (error) {
        return res.status(500).json({ 
          message: "Failed to create account", 
          error: error.message 
        });
      }
} 
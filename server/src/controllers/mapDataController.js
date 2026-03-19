import { supabase } from '../config/supabase.js';


export const getMap = async (req, res) => {
    console.log("fetching data");
    try{
        const { data: spots, error } = await supabase
            .from('spot')
            .select('*');
        
        if(error){
            res.status(400).json({error: 'failed to get spot types'});
        }
        if(spots){
            res.status(200).json({spots: spots});
        }
    }catch(err){
        res.status(500).json({ error: "Internal server error." });
    }
    
} 
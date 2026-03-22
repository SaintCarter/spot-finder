import { supabase } from '../config/supabase.js';


export const getMap = async (req, res) => {
    console.log("fetching data");
    try{
        const { data: spots, error:spotError } = await supabase
            .from('spot')
            .select('*');
        
        if(spotError){
            res.status(400).json({error: 'failed to get spot data'});
        }
        if(spots){
            res.status(200).json({spots: spots});
        }

    }catch(err){
        res.status(500).json({ error: "Internal server error." });
    }
    
}

export const getSpotMedia = async (req, res) => {
    const { spotId } = req.body;
    try{
        const { data: spotMedia, error } = await supabase
            .from('spot_media')
            .select('*')
            .eq('spotid', spotId);
        
        if(error){
            res.status(400).json({error: 'failed to get spot data'});
        }
        if(spotMedia){
            res.status(200).json({spotMedia});
        }

    }catch(err){
        res.status(500).json({ error: "Internal server error." });
    }
    
} 
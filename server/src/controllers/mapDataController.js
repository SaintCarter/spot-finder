import { supabase } from '../config/supabase.js';


export const getMap = async (req, res) => {
    console.log("fetching map data");
    try{
        const { data: spots, error:spotError } = await supabase
            .from('spot')
            .select('*');
        
        if(spotError){
            res.status(400).json({error: 'failed to get spot data'});
        }
        const { data: types, error:typeError } = await supabase
            .from('spot_has_types')
            .select('*');

        if(typeError){
            res.status(400).json({error: 'failed to get spot types'});
        }
        const { data: typeNames, error } = await supabase
            .from('spot_type')
            .select('*');
        
        if(error){
            res.status(400).json({error: 'failed to get spot type names'});
        }

        if(spots && types){
            res.status(200).json({spots: spots, types: types, typeNames: typeNames });
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
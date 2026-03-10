import { supabase } from '../config/supabase.js';


export const getSpotTypes = async (req, res) => {
    try{
        const { data: spot_type, error } = await supabase
            .from('spot_type')
            .select('*');
        
        if(error){
            res.status(400).json({error: 'failed to get spot types'});
        }
        if(spot_type){
            res.status(200).json({spotTypes: spot_type});
        }
    }catch(err){
        res.status(500).json({ error: "Internal server error." });
    }
    
} 
export const createSpot = async (req, res) => {
    let mainUrl;
    try{
        const { spotname, description, hasSecurity, creatorId, latitude, longitude, spottype } = req.body;
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No media file provided' });
        }
        const fileName = `${Date.now()}-${file.originalname}`;
        console.log(fileName);

        const { data: mediaData, error: mediaError } = await supabase.storage.from('spots').upload(fileName, file)
        if (mediaError) {
            console.log(mediaError);
            res.status(400).json({success:false, error: mediaError});
        } else {
            mainUrl = mediaData.id;
        }

        const { data, error } = await supabase
            .from('spot')
            .insert([
                { creatorid: creatorId, spottypeid: spottype, name: spotname, description: description, hassecurity: hasSecurity, latitude: latitude, longitude: longitude, mainurl: mainUrl  },
            ])
            .select()
        if (error) {
            console.log(error);
            res.status(400).json({success:false, error: error});
        } else {
            console.log(data);
            res.status(200).json({success:true, message:'success'});
        }
    
    }catch(err){
        res.status(500).json({ error: "Internal server error." });
    }
    
} 
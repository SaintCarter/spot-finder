import { supabase } from '../config/supabase.js';


export const getSpotTypes = async (req, res) => {
    try{
        const { data: spot_type, error } = await supabase
            .from('spot_type')
            .select('*');
        
        if(error){
            return res.status(400).json({error: 'failed to get spot types'});
        }
        if(spot_type){
            return res.status(200).json({spotTypes: spot_type});
        }
    }catch(err){
        return res.status(500).json({ error: "Internal server error." });
    }
    
} 




export const insertRating = async (req, res) => {
    const { spotId, rating } = req.body;
    const userId = req.user.userId;

    if(!rating || !spotId){
        return res.status(400).json({error: 'failed to insert rating'});
    }
    if(rating > 5 || rating < 1){
        return res.status(400).json({error: 'failed to insert rating'});
    }
    try{
        const { data , error } = await supabase
            .from('spot_rating')
            .insert([
                {
                    usersid: userId,
                    rating: rating,
                    spotid: spotId
                }
            ])
            .select();
        
        if(error){
            return res.status(400).json({error: 'failed to insert rating'});
        }

        return res.status(200).json({success: true, message:"rating inserted"});

    }catch(err){
        return res.status(500).json({ error: "Internal server error." });
    }
    
} 


export const updateRating = async (req, res) => {
    const { spotId, rating } = req.body;
    const userId = req.user.userId;

    if(!rating || !spotId){
        return res.status(400).json({error: 'failed to insert rating'});
    }
    if(rating > 5 || rating < 1){
        return res.status(400).json({error: 'failed to insert rating'});
    }
    try{
        const { data, error } = await supabase
            .from('spot_rating')
            .update({ rating: rating })
            .eq('usersid', userId)
            .eq('spotid', spotId)
            .select();
        
        if(error){
            return res.status(400).json({error: 'failed to update rating'});
        }

        return res.status(200).json({success: true, message:"rating updated"});

    }catch(err){
        return res.status(500).json({ error: "Internal server error." });
    }
    
} 



export const getRatings = async (req, res) => {
    const { spotId } = req.body;

    if(!spotId){
        return res.status(400).json({error: 'failed to get ratings no spot selected'});
    }
    try{
        const { data: ratings , error } = await supabase
            .from('spot_rating')
            .select('rating')
            .eq('spotid', spotId);
        
        if(error){
            res.status(400).json({error: 'failed to get ratings'});
        }
        if(ratings){
            return res.status(200).json({ratings});
        }

    }catch(err){
        return res.status(500).json({ error: "Internal server error." });
    }
    
} 


export const checkUniqueRating = async (req, res) => {
    const { spotId } = req.body;
    const userId = req.user.userId;

    try {
        const { data, error } = await supabase
            .from('spot_rating')
            .select('spotid, usersid, rating')
            .eq('spotid', spotId)
            .eq('usersid', userId)
            .maybeSingle();

        if (error) throw error;

        const rated = !!data;
        const rating = data ? data.rating: 0;

        return res.status(200).json({ rated, rating});
        
    } catch (err) {
        console.error('CheckUnique Error:', err);
        return res.status(500).json({ message: "Internal server error" });
    }
}





export const createSpot = async (req, res) => {
    try {
        const { spotname, description, hasSecurity, creatorId, latitude, longitude, } = req.body;
        const files = req.files;
        let spotTypes = req.body.spottype;

        if (!Array.isArray(spotTypes)) {
            spotTypes = [spotTypes];
        }

        

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No media file provided' });
        }

        const uploadedMedia = [];

        // Upload files
        for (const file of files) {
            const fileName = `${Date.now()}-${file.originalname}`;

            const { error: mediaError } = await supabase.storage
                .from('spots')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                });

            if (mediaError) {
                console.log(mediaError);
                return res.status(400).json({ error: 'Upload failed' });
            }

            const { data: { publicUrl } } = supabase.storage
                .from('spots')
                .getPublicUrl(fileName);

            uploadedMedia.push({
                url: publicUrl,
                type: file.mimetype.startsWith("video/") ? "video" : "image"
            });
        };

        //Create spot
        const { data: spotData, error: spotError } = await supabase
            .from('spot')
            .insert([
                {
                    creatorid: creatorId,
                    name: spotname,
                    description,
                    hassecurity: hasSecurity === "true",
                    latitude,
                    longitude,
                }
            ])
            .select();

        if (spotError) {
            console.log(spotError);
            return res.status(400).json({ error: 'Failed to create spot' });
        }

        const spotId = spotData[0].id;//needed for sub spot tables

        const typeRows = spotTypes.map((type) => ({
            spotid: spotId,
            spottypeid: type,
        }));

        const { error: typeInsertError } = await supabase
            .from('spot_has_types')
            .insert(typeRows);

        if (typeInsertError) {
            console.log(typeInsertError);
            return res.status(400).json({ error: 'Failed to save types' });
        }

        // Insert media
        const mediaRows = uploadedMedia.map((media) => ({
            spotid: spotId,
            url: media.url,
            type: media.type
        }));

        const { error: mediaInsertError } = await supabase
            .from('spot_media')
            .insert(mediaRows);

        if (mediaInsertError) {
            console.log(mediaInsertError);
            return res.status(400).json({ error: 'Failed to save media' });
        }

        return res.status(200).json({
            success: true,
            message: 'Spot created successfully'
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error." });
    }
};
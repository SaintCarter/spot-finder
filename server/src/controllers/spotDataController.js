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
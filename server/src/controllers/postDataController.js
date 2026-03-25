import { supabase } from '../config/supabase.js';


export const createPost = async (req, res) => {
    try {
        const { caption, creatorId, spotId } = req.body;
        const files = req.files;

        

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'No media file provided' });
        }

        const uploadedMedia = [];

        // Upload files
        for (const file of files) {
            const fileName = `${Date.now()}-${file.originalname}`;

            const { error: mediaError } = await supabase.storage
                .from('posts')
                .upload(fileName, file.buffer, {
                    contentType: file.mimetype,
                });

            if (mediaError) {
                console.log(mediaError);
                return res.status(400).json({ error: 'Upload failed' });
            }

            const { data: { publicUrl } } = supabase.storage
                .from('posts')
                .getPublicUrl(fileName);

            uploadedMedia.push({
                url: publicUrl,
                type: file.mimetype.startsWith("video/") ? "video" : "image"
            });
        };

        //Create spot
        const { data: postData, error: postError } = await supabase
            .from('spot_post')
            .insert([
                {
                    creatorid: creatorId,
                    spotid: spotId,
                    caption,
                }
            ])
            .select();

        if (postError) {
            console.log(postError);
            return res.status(400).json({ error: 'Failed to create post' });
        }

        const postId = postData[0].id; //needed for inserting media


        // Insert media
        const mediaRows = uploadedMedia.map((media) => ({
            postid: postId,
            url: media.url,
            type: media.type
        }));

        const { error: mediaInsertError } = await supabase
            .from('spot_post_media')
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
import { supabase } from '../config/supabase.js';
import FormData from 'form-data';
import axios from 'axios';

export default async function removeBg(req, res, next) {
    if (!req.file) return;

    try {
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('type', 'auto');
        formData.append('image_file', req.file.buffer, {
            filename: req.file.originalname || 'image.png',
            contentType: req.file.mimetype || 'image/png',
        });
        const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
            ...formData.getHeaders(),
            'X-Api-Key': process.env.REMOVE_BG_KEY,
        },
        responseType: 'arraybuffer',
        });

        if (response.status !== 200) {
            throw new Error(`Remove.bg API error: ${response.status} - ${response.statusText}`);
        }

        if(!response) throw new Error("No response from Remove.bg API");

        const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

        // 2. Upload the processed buffer to Supabase
        const { data, error: insertError} = await supabase.storage
        .from('boards')
        .upload(fileName, response.data, {
            contentType: 'image/png'
        });

        if (insertError) throw insertError;

        // 3. Get the Public URL
        const { data: { publicUrl } } = supabase.storage
        .from('boards')
        .getPublicUrl(fileName);

        // 4. Attach the URL to req so the next function (createAccount controller) can save it to the DB
        req.processedImageUrl = publicUrl;
        
        next();
    } catch (error) {

        console.error("Remove.bg failed, uploading original image instead:", error.message);

        // Fallback: upload the original image
        const fileName = `profile-${Date.now()}-${Math.random().toString(36).substring(7)}.png`;
        const { data, uploadError } = await supabase.storage
            .from('boards')
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype || 'image/png'
            });

        if (uploadError) {
            console.error("Failed to upload original image:", uploadError);
            return res.status(500).json({ success: false, error: "Failed to upload image" });
        }

        const { data: { publicUrl } } = supabase.storage
            .from('boards')
            .getPublicUrl(fileName);

        req.processedImageUrl = publicUrl;
        console.log("Original image uploaded successfully:", publicUrl);
        next();
    }

}
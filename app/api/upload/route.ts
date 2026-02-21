import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Max size: 5MB" },
                { status: 400 }
            );
        }

        const service = createServiceClient();

        // Generate unique filename
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const { error: uploadError } = await service.storage
            .from("post-images")
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("Upload error:", uploadError);
            return NextResponse.json(
                { error: "Failed to upload image. Make sure the 'post-images' storage bucket exists in Supabase." },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = service.storage
            .from("post-images")
            .getPublicUrl(filename);

        return NextResponse.json({
            url: urlData.publicUrl,
            filename,
        });
    } catch (err) {
        console.error("Upload error:", err);
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        );
    }
}

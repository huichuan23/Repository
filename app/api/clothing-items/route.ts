import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { analyzeClothingImage } from "@/lib/analyzeClothingImage";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

type ClothingItemInput = {
  name: string;
  category: string;
  image_url?: string;
  colors?: string[];
  material?: string;
  fit?: string;
  seasons?: string[];
  styles?: string[];
  occasions?: string[];
  comfort_score?: number;
  notes?: string;
};

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("clothing_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ items: data });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const image = formData.get("image");

      if (!(image instanceof File)) {
        return NextResponse.json(
          { error: "image file is required." },
          { status: 400 }
        );
      }

      if (!image.type.startsWith("image/")) {
        return NextResponse.json(
          { error: "Only image uploads are supported." },
          { status: 400 }
        );
      }

      const supabase = getSupabaseAdmin();
      const bytes = Buffer.from(await image.arrayBuffer());
      const dataUrl = `data:${image.type};base64,${bytes.toString("base64")}`;
      const analysis = await analyzeClothingImage(dataUrl);

      await supabase.storage.createBucket("clothing-images", {
        public: true,
        fileSizeLimit: 10485760,
        allowedMimeTypes: [
          "image/jpeg",
          "image/png",
          "image/webp",
          "image/heic",
          "image/heif"
        ]
      });

      const extension = image.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from("clothing-images")
        .upload(path, bytes, {
          contentType: image.type,
          upsert: false
        });

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }

      const { data: publicUrl } = supabase.storage
        .from("clothing-images")
        .getPublicUrl(path);
      const { data, error } = await supabase
        .from("clothing_items")
        .insert({
          name: analysis.name,
          category: analysis.category,
          image_url: publicUrl.publicUrl,
          colors: analysis.colors,
          material: analysis.material,
          fit: analysis.fit,
          seasons: analysis.seasons,
          styles: analysis.styles,
          occasions: analysis.occasions,
          notes: analysis.notes
        })
        .select("*")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ item: data, analysis }, { status: 201 });
    }

    const body = (await request.json()) as ClothingItemInput;

    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "name and category are required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("clothing_items")
      .insert({
        name: body.name,
        category: body.category,
        image_url: body.image_url ?? null,
        colors: body.colors ?? [],
        material: body.material ?? null,
        fit: body.fit ?? null,
        seasons: body.seasons ?? [],
        styles: body.styles ?? [],
        occasions: body.occasions ?? [],
        comfort_score: body.comfort_score ?? null,
        notes: body.notes ?? null
      })
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

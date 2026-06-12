import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

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

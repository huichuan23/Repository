import { NextResponse } from "next/server";
import { getOpenAIClient, recommendationModel } from "@/lib/openai";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type RecommendationRequest = {
  occasion: string;
  weather?: string;
  mood?: string;
  formality?: "casual" | "smart-casual" | "formal";
};

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as RecommendationRequest;

    if (!input.occasion) {
      return NextResponse.json(
        { error: "occasion is required." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: wardrobe, error: wardrobeError } = await supabase
      .from("clothing_items")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(120);

    if (wardrobeError) {
      return NextResponse.json({ error: wardrobeError.message }, { status: 500 });
    }

    const openai = getOpenAIClient();
    const response = await openai.responses.create({
      model: recommendationModel,
      input: [
        {
          role: "system",
          content:
            "你是一个私人穿搭助理。只根据用户衣柜中的单品推荐搭配，输出简洁、具体、可执行的 JSON。"
        },
        {
          role: "user",
          content: JSON.stringify({
            request: input,
            wardrobe
          })
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "outfit_recommendation",
          strict: true,
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              title: { type: "string" },
              reason: { type: "string" },
              item_ids: {
                type: "array",
                items: { type: "string" }
              },
              tags: {
                type: "array",
                items: { type: "string" }
              }
            },
            required: ["title", "reason", "item_ids", "tags"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.output_text);
    const { data: outfit, error: outfitError } = await supabase
      .from("outfits")
      .insert({
        title: parsed.title,
        reason: parsed.reason,
        occasion: input.occasion,
        weather: input.weather ?? null,
        mood: input.mood ?? null,
        formality: input.formality ?? null,
        tags: parsed.tags ?? [],
        source: "openai"
      })
      .select("*")
      .single();

    if (outfitError) {
      return NextResponse.json({ error: outfitError.message }, { status: 500 });
    }

    if (parsed.item_ids?.length) {
      const rows = parsed.item_ids.map((itemId: string) => ({
        outfit_id: outfit.id,
        clothing_item_id: itemId
      }));
      const { error: linkError } = await supabase.from("outfit_items").insert(rows);

      if (linkError) {
        return NextResponse.json({ error: linkError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ outfit, recommendation: parsed });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

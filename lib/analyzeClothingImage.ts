import { getOpenAIClient, recommendationModel } from "@/lib/openai";

export type ClothingAnalysis = {
  name: string;
  category: string;
  colors: string[];
  material: string | null;
  fit: string | null;
  seasons: string[];
  styles: string[];
  occasions: string[];
  notes: string | null;
};

const clothingAnalysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    name: { type: "string" },
    category: { type: "string" },
    colors: {
      type: "array",
      items: { type: "string" }
    },
    material: {
      anyOf: [{ type: "string" }, { type: "null" }]
    },
    fit: {
      anyOf: [{ type: "string" }, { type: "null" }]
    },
    seasons: {
      type: "array",
      items: { type: "string" }
    },
    styles: {
      type: "array",
      items: { type: "string" }
    },
    occasions: {
      type: "array",
      items: { type: "string" }
    },
    notes: {
      anyOf: [{ type: "string" }, { type: "null" }]
    }
  },
  required: [
    "name",
    "category",
    "colors",
    "material",
    "fit",
    "seasons",
    "styles",
    "occasions",
    "notes"
  ]
};

export async function analyzeClothingImage(dataUrl: string) {
  const openai = getOpenAIClient();
  const response = await openai.chat.completions.create({
    model: recommendationModel,
    messages: [
      {
        role: "system",
        content:
          "你是私人衣柜整理助理。根据单件衣服照片识别衣服属性，必须用简体中文输出 JSON。不要猜品牌和价格。"
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text:
              "请识别这件衣服。category 只能用一个主品类，例如 外套、上衣、裤子、裙子、鞋、包、配饰。colors、seasons、styles、occasions 用简短标签。"
          },
          {
            type: "image_url",
            image_url: {
              url: dataUrl
            }
          }
        ] as any
      }
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "clothing_analysis",
        strict: true,
        schema: clothingAnalysisSchema
      }
    }
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI did not return clothing analysis.");
  }

  return JSON.parse(content) as ClothingAnalysis;
}

"use server";
import { client } from "@/app/lib/microcms";
import { log } from "console";
import { revalidatePath } from "next/cache";

// フォーム送信のためのサーバーアクション
export async function submitForm(_prevState: any, formData: FormData) {
  const campaignId = formData.get("campaignId") as string;
  const productIds = formData.get("productIds") as string;

  // 入力の検証
  if (!validateInput(campaignId, productIds)) {
    console.error("入力エラー");
    return { success: false, message: "入力が無効です。" };
  }

  // データの処理
  const productIdArray = parseProductIds(productIds);
  const result = await updateProductCampaigns(productIdArray, campaignId);

  // ページの再検証
  revalidatePath("/dev");

  return result;
}

// 入力検証ヘルパー
function validateInput(campaignId: string, productIds: string): boolean {
  return Boolean(campaignId.trim() && productIds.trim());
}

// テキスト入力から商品IDを解析
function parseProductIds(productIds: string): string[] {
  return productIds.split("\n").filter((id) => id.trim());
}

// 商品の既存キャンペーンデータを取得
async function fetchProductCampaigns(productId: string): Promise<string[]> {
  const response = await client.getListDetail({
    endpoint: "desc-cp-a",
    contentId: productId,
    queries: {
      fields: ["campaigns.id"],
    },
  });

  return response.campaigns.map((campaign: any) => campaign.id);
}

// 単一商品のキャンペーンデータを更新
async function updateProductWithCampaign(
  productId: string,
  campaignIds: string[]
) {
  return await client.update({
    endpoint: "desc-cp-a",
    contentId: productId,
    content: {
      campaigns: campaignIds,
    },
  });
}

// 商品とキャンペーンの紐付けを更新するメイン処理
async function updateProductCampaigns(
  productIds: string[],
  newCampaignId: string
) {
  console.log(productIds);
  console.log(newCampaignId);

  const results = [];
  let hasError = false;
  let errorMessage = "";

  // 各商品IDを処理
  for (const productId of productIds) {
    try {
      // 既存のキャンペーンを取得
      const existingCampaignIds = await fetchProductCampaigns(productId);
      console.log({ existingCampaignIds });
      // 新しいキャンペーンが存在しない場合のみ追加
      const updatedCampaignIds = existingCampaignIds.includes(newCampaignId)
        ? existingCampaignIds
        : [...existingCampaignIds, newCampaignId];

      // 商品のキャンペーンデータを更新
      const result = await updateProductWithCampaign(
        productId,
        updatedCampaignIds
      );
      console.log({ result });
      results.push(`商品ID ${productId} のキャンペーンデータを更新しました。`);
    } catch (error) {
      console.error(
        `商品ID ${productId} の更新中にエラーが発生しました:`,
        error
      );
      hasError = true;
      errorMessage = `商品ID ${productId} の更新中にエラーが発生しました: ${error}`;
      // エラーが発生しても処理を続行
    }
  }

  if (hasError && results.length === 0) {
    return {
      success: false,
      message: errorMessage,
    };
  }

  return {
    success: true,
    message:
      results.join("\n") +
      "\nhttps://maf8ibsb9h.microcms.io/apis/desc-cp-a/ にアクセスして確認してください。",
  };
}

/* 
ID例:
cp1:iqscuxcaxu
cp10:c_ow8zdf4c
product:4973655812136
*/

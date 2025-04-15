import React from "react";
import { client } from "@/app/lib/microcms";

const getCampaignIdsByProductId = async (productId: string) => {
  const results = await client.getList({
    endpoint: "cp-relation-products",
    queries: {
      q: productId,
      fields: "campaign.id",
    },
  });
  const campaignIds = results.contents.map((campaign) => campaign.campaign.id);

  return campaignIds;
};

const getCampaignId = async (campaignId: string) => {
  const campaign = await client.getListDetail({
    endpoint: "cp-1",
    contentId: campaignId,
  });
  return campaign;
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const startTime = performance.now();

  const campaignIds = await getCampaignIdsByProductId(id);
  const afterFirstCall = performance.now();
  const firstCallTime = afterFirstCall - startTime;

  const campaigns = [];
  for (const campaignId of campaignIds) {
    const campaign = await getCampaignId(campaignId);
    campaigns.push(campaign);
  }
  const afterSecondCall = performance.now();
  const secondCallTime = afterSecondCall - afterFirstCall;

  const totalTime = afterSecondCall - startTime;

  return (
    <div className="p-10 bg-gray-100 w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">商品コード：{id}</h1>
        <div className="flex flex-col gap-4 bg-white p-4 rounded-md">
          <div className="text-lg font-bold">実行時間</div>
          <div>getCampaignIdsByProductId: {firstCallTime.toFixed(2)} ms</div>
          <div>getCampaignId (all): {secondCallTime.toFixed(2)} ms</div>
          <div>Total Time: {totalTime.toFixed(2)} ms</div>
        </div>

        <div className="flex flex-col gap-4 bg-orange-300 p-4 rounded-md">
          <div className="text-lg font-bold">CP概要</div>
          {campaigns.map((campaign, index) => (
            <div
              key={campaignIds[index]}
              className="bg-green-500 text-white p-2 rounded-md font-bold text-xl"
            >
              {campaign.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

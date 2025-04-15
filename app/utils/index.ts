import { client } from "../lib/microcms";

export const getCampaignIdsByProductId = async (productId: string) => {
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

export const getCampaignId = async (campaignId: string) => {
  const campaign = await client.getListDetail({
    endpoint: "cp-1",
    contentId: campaignId,
  });
  return campaign;
};

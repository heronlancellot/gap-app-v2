import { Hex } from "viem";

// EAS contracts
export const ARB_ONE_EAS = "0xbD75f629A22Dc1ceD33dDA0b68c546A1c035c458";
export const ARB_ONE_SCHEMA_REGISTRY = "0xA310da9c5B885E7fb3fbA9D66E9Ba6Df512b78eB";

// The schema UID for EAS
export const KARMA_EAS_SCHEMA_UID =
  "0x02dc5a92e5634ce3d8dd933067df1b53f661b1a53bcf8f17110c7d1ff884621f";
// The Karma-Gap scorer ID constant
export const SCORER_ID = 1;
// The Karma-Gap scorer decimals amount
export const SCORER_DECIMALS = 18;

// The Trustful-Karma contracts
export const GRANT_REGISTRY = "0x676FD4b8bC208460D9E438F7aAA5E95D580aBB8f";
export const BADGE_REGISTRY = "0xF0d7f324521B6f93EA6b9B8DB934E1D01C0c75b0";
export const TRUSTFUL_SCORER = "0x3B0C859cD18B836Df11bB7c45E22993a5AbA0069";
export const RESOLVER_EAS = "0x9533A8B883128412ed228e73292D5DE55fd7cAe9";
export const RESOLVER_TRUSTFUL = "0x44b17f32Be8Dde88a43A0A39F3801343f2d5D446";

/** Pre-review form interfaces to connect form to the API. */
export interface PreReviewAnswers {
  category: Category;
  otherCategoryDescriptions?: string;
  receivedGrant: ReceivedGrant;
}

export interface CreatePreReviewRequest {
  preReviewAnswers: PreReviewAnswers;
  connectedUserAddress: Address;
  programId: number;
}

export enum CategoryOptions {
  DevTooling = "Dev tooling",
  Education = "Education",
  MarketingAndGrowth = "Marketing and Growth",
  DeFi = "DeFi",
  DAOsAndGovernance = "DAOs and Governance",
  Community = "Community",
  Gaming = "Gaming",
  PublicGoods = "Public Goods",
  ZKAndPrivacy = "ZK and privacy",
  Other = "Other",
}

export enum ReceivedGrantOptions {
  Yes = "Yes, I got approved",
  No = "No",
  Pending = "I don't have the answer yet",
}

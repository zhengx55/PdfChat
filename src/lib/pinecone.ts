import { Pinecone } from "@pinecone-database/pinecone";

export const pinecone = new Pinecone({
  environment: "gcp-starter",
  apiKey: "4e926d7b-71ca-473f-b00e-1dd5ee99fae2",
});

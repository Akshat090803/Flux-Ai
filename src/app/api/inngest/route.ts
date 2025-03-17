import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { generateIndustryInsights, } from "@/inngest/function";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    generateIndustryInsights
  ],
});



//!Read setup documentaion
// https://www.inngest.com/docs/getting-started/nextjs-quick-start?ref=docs-home
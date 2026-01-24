import { defineCloudflareConfig } from "@opennextjs/cloudflare";

const config = defineCloudflareConfig({});
// Avoid resolving the "workerd" export condition (Stripe doesn't ship it).
config.cloudflare = { useWorkerdCondition: false };

export default config;

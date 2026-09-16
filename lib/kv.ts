// Cliente Redis (Upstash) de uso general para las automatizaciones (baselines de
// cambios en documentos, etc.). Reutiliza las mismas variables que el rate limit.
import { Redis } from "@upstash/redis";

const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

export const kv = url && token ? new Redis({ url, token }) : null;

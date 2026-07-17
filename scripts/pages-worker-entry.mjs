import vinextWorker from "./vinext.js";

const STATIC_METHODS = new Set(["GET", "HEAD"]);

const pagesWorker = {
  async fetch(request, env, context) {
    if (STATIC_METHODS.has(request.method) && env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);

      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    return vinextWorker.fetch(request, env, context);
  },
};

export default pagesWorker;

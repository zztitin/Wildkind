import vinextWorker from "./vinext.js";

const STATIC_METHODS = new Set(["GET", "HEAD"]);
const CANONICAL_HOST = "pet-wildkind.co.uk";

const pagesWorker = {
  async fetch(request, env, context) {
    const requestUrl = new URL(request.url);

    if (requestUrl.hostname === `www.${CANONICAL_HOST}`) {
      requestUrl.protocol = "https:";
      requestUrl.hostname = CANONICAL_HOST;
      requestUrl.port = "";
      return Response.redirect(requestUrl.toString(), 308);
    }

    if (STATIC_METHODS.has(request.method) && env.ASSETS) {
      if (requestUrl.pathname === "/_vinext/image") {
        const sourcePath = requestUrl.searchParams.get("url");

        if (sourcePath?.startsWith("/") && !sourcePath.startsWith("//")) {
          const sourceUrl = new URL(sourcePath, requestUrl);
          const sourceResponse = await env.ASSETS.fetch(new Request(sourceUrl, request));

          if (sourceResponse.status !== 404) {
            return sourceResponse;
          }
        }
      }

      const assetResponse = await env.ASSETS.fetch(request);

      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    return vinextWorker.fetch(request, env, context);
  },
};

export default pagesWorker;

import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/product",
    "/pricing",
    "/vs-hotschedules",
    "/for/gms",
    "/for/staff",
    "/for/groups",
    "/demo",
  ];
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : path === "/demo" ? 0.9 : 0.7,
  }));
}

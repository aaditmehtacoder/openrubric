import { redirect } from "next/navigation";
import { SITE } from "@/lib/constants";

/** Convenience route: /github → the external repository. */
export default function GitHubRedirect() {
  redirect(SITE.githubUrl);
}

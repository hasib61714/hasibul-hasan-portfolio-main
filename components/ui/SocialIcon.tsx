import { Instagram, Twitter, Youtube } from "lucide-react";
import { FacebookIcon, GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import type { SocialKey } from "@/lib/profile-defaults";

export function SocialIcon({ name, className }: { name: SocialKey; className?: string }) {
  switch (name) {
    case "github":    return <GitHubIcon className={className} />;
    case "linkedin":  return <LinkedInIcon className={className} />;
    case "facebook":  return <FacebookIcon className={className} />;
    case "twitter":   return <Twitter className={className} />;
    case "youtube":   return <Youtube className={className} />;
    case "instagram": return <Instagram className={className} />;
  }
}

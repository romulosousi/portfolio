import type { SkillGroup } from "@/types";
import type { Translations } from "@/i18n/types";

export function buildSkills(t: Translations): SkillGroup[] {
  return [
    {
      titulo: t.sk_g1,
      items: ["Python", "Java", "Django", "FastAPI", "Git", "GitHub"],
    },
    {
      titulo: t.sk_g2,
      items: ["Selenium", "PyAutoGUI", "Requests", "IMAP"],
    },
    {
      titulo: t.sk_g3,
      items: ["Pandas", "OpenPyXL", "Regex", "APIs REST"],
    },
    {
      titulo: t.sk_g7,
      items: [
        "Docker",
        "Docker Compose",
        "Kubernetes",
        "Linux",
        "GitHub Actions",
        "Nginx",
        "Redis",
      ],
    },
    { titulo: t.sk_g5, items: t.sk_domain_items },
  ];
}

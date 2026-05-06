import type { SkillGroup } from "@/types";
import type { Translations } from "@/i18n/types";

export function buildSkills(t: Translations): SkillGroup[] {
  return [
    {
      titulo: t.sk_g1,
      items: ["Python", "Django", "FastAPI", "Git", "GitHub"],
    },
    {
      titulo: t.sk_g2,
      items: ["Selenium", "PyAutoGUI", "Requests", "IMAP"],
    },
    {
      titulo: t.sk_g3,
      items: ["Pandas", "OpenPyXL", "Regex", "APIs REST", t.sk_extra_a1],
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
    {
      titulo: t.sk_g4,
      items: [
        "Holmes",
        "DominioWeb",
        "Novajus",
        "Thomson Reuters",
        "MV Soul",
        "Pipefy",
        "Elaw",
        "GCPJ",
        "Citrix",
        "Microsoft Authenticator",
        "Active Directory",
        "Microsoft Dynamics",
        "Assyst",
        "Zabbix",
        "Deskmanager",
      ],
    },
    { titulo: t.sk_g5, items: t.sk_domain_items },
    { titulo: t.sk_g6, items: t.sk_extra_methods },
  ];
}

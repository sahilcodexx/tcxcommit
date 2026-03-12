import { Package, Github } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { HomeContent } from "@/components/home/home-content";

interface NpmData {
  version: string;
  downloads: number;
}

interface GithubData {
  stars: number;
}

async function getNpmData(): Promise<NpmData> {
  try {
    const res = await fetch("https://registry.npmjs.org/termycommit", {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    
    const downloadsRes = await fetch(
      "https://api.npmjs.org/downloads/point/last-week/termycommit"
    );
    const downloadsData = await downloadsRes.json();
    
    return {
      version: data["dist-tags"]?.latest || "1.0.0",
      downloads: downloadsData.downloads || 0
    };
  } catch {
    return { version: "1.0.0", downloads: 0 };
  }
}

async function getGithubData(): Promise<GithubData> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/sahilcodexx/termyCommit",
      { 
        next: { revalidate: 60 },
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      }
    );
    
    if (!res.ok) {
      return { stars: 1 };
    }
    
    const data = await res.json();
    return { stars: data.stargazers_count ?? 1 };
  } catch {
    return { stars: 1 };
  }
}

export default async function Home() {
  const [npmData, githubData] = await Promise.all([
    getNpmData(),
    getGithubData()
  ]);

  return (
    <HomeContent 
      version={npmData.version} 
      downloads={npmData.downloads} 
      stars={githubData.stars}
    />
  );
}

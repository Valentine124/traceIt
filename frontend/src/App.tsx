import { useState } from "react";
import { type View, type Language } from "./types";
import { TopNav, Footer } from "./components/Navigation";
import { HomeView } from "./views/HomeView";
import { ExplorerView } from "./views/ExplorerView";
import { ProjectDetailView } from "./views/ProjectDetailView";
import { ReportView } from "./views/ReportView";
import { MyReportsView } from "./views/MyReportsView";
import { AIExplainerView } from "./views/AIExplainerView";
import { LearnView, AboutView, ProfileView, ReportTrackingConfirmView } from "./views/PlaceholderViews";
import { LANGUAGES } from "./data/mockData";

export default function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("proj-001");
  const [isOnline] = useState(true);

  const currentLang = LANGUAGES.find((l) => l.code === language)!;

  const navigate = (view: View, projectId?: string) => {
    if (projectId) setSelectedProjectId(projectId);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const dir = currentLang.dir;

  return (
    <div
      dir={dir}
      style={{
        minHeight: "100vh",
        background: "var(--color-parchment)",
        fontFamily: "var(--font-body)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopNav
        currentView={currentView}
        onNavigate={navigate}
        language={language}
        onLanguageChange={handleLanguageChange}
        isOnline={isOnline}
      />

      {/* Skip to content for accessibility */}
      <a
        href="#main-content"
        style={{
          position: "absolute",
          top: -40,
          left: 8,
          padding: "0.5rem 1rem",
          background: "var(--color-primary)",
          color: "white",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: "0.875rem",
          textDecoration: "none",
          zIndex: 9999,
          transition: "top 0.15s ease",
        }}
        onFocus={(e) => { (e.target as HTMLElement).style.top = "8px"; }}
        onBlur={(e) => { (e.target as HTMLElement).style.top = "-40px"; }}
      >
        Skip to main content
      </a>

      <div id="main-content" style={{ flex: 1 }}>
        {currentView === "home" && <HomeView onNavigate={navigate} />}
        {currentView === "explorer" && <ExplorerView onNavigate={navigate} />}
        {currentView === "project-detail" && (
          <ProjectDetailView projectId={selectedProjectId} onNavigate={navigate} />
        )}
        {currentView === "reality-check" && (
          <ProjectDetailView projectId={selectedProjectId} onNavigate={navigate} />
        )}
        {currentView === "report" && (
          <ReportView onNavigate={navigate} prefillProjectId={selectedProjectId} />
        )}
        {currentView === "my-reports" && <MyReportsView onNavigate={navigate} />}
        {currentView === "report-tracking" && <ReportTrackingConfirmView onNavigate={navigate} />}
        {currentView === "ai-explainer" && (
          <AIExplainerView projectId={selectedProjectId} onNavigate={navigate} />
        )}
        {currentView === "what-can-i-do" && (
          <ProjectDetailView projectId={selectedProjectId} onNavigate={navigate} />
        )}
        {currentView === "learn" && <LearnView onNavigate={navigate} />}
        {currentView === "about" && <AboutView onNavigate={navigate} />}
        {currentView === "profile" && <ProfileView onNavigate={navigate} />}
      </div>

      <Footer onNavigate={navigate} />
    </div>
  );
}

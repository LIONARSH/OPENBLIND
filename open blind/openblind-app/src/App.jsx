
import React, { useState } from "react";
import "./index.css";
import useVoiceCommands from "./presentation/hooks/useVoiceCommands";
import { StarBackground } from "./presentation/components/features/SharedComponents";
import Dashboard from "./presentation/pages/Dashboard";
import LugaresView from "./presentation/pages/LugaresView";
import ContactosView from "./presentation/pages/ContactosView";
import UbicacionView from "./presentation/pages/UbicacionView";

function App() {
  const [currentView, setCurrentView] = useState("dashboard");

  const { startListening } = useVoiceCommands((command) => {
    console.log("Comando:", command.action);
    if (command.action !== "dashboard" && command.action !== "help") {
      setCurrentView(command.action);
    }
  });

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onChangeView={setCurrentView} />;
      case "lugares":
        return <LugaresView onBack={() => setCurrentView("dashboard")} />;
      case "contactos":
        return <ContactosView onBack={() => setCurrentView("dashboard")} />;
      case "ubicacion":
        return <UbicacionView onBack={() => setCurrentView("dashboard")} />;
      default:
        return <Dashboard onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="app-container">
      <StarBackground />
      {renderView()}
      <button onClick={startListening} style={{position:"fixed", bottom:20, right:20}}>
        🎤
      </button>
    </div>
  );
}

export default App;

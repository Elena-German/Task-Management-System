import { createRoot } from "react-dom/client";
import App from "App";

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container as HTMLElement);
  root.render(<App />);
} else {
  throw new Error(
    "Корневой элемент с идентификатором root не найден в документе. Убедитесь, что в вашем HTML-файле есть соответствующий HTML-элемент с идентификатором root."
  );
}

import AppHome from "./components/AppHome";
import ErrorBoundary from "./components/ErrorBoundary";

const App = () => {
  return (
    <ErrorBoundary>
      <AppHome />
    </ErrorBoundary>
  );
};

export default App;

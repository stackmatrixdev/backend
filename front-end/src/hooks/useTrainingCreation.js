import { useContext } from "react";
// fix: correct relative path to the contexts folder
import TrainingCreationContext from "../contexts/TrainingCreationContext";

// Custom hook to use the training creation context
export const useTrainingCreation = () => {
  const context = useContext(TrainingCreationContext);
  if (!context) {
    throw new Error(
      "useTrainingCreation must be used within a TrainingCreationProvider"
    );
  }
  return context;
};
